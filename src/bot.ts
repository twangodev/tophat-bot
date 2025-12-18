import { createActor } from 'xstate';
import { botMachine, BotState } from './machine';
import { BrowserManager } from './browser/manager';
import { PageListener } from './browser/page-listener';
import { events } from './events/emitter';
import { config } from './config';
import { log, spinner } from './utils/log';

export class Bot {
  private actor = createActor(botMachine);
  private browser = new BrowserManager();
  private pageListener: PageListener | null = null;
  private startupComplete = false;

  constructor() {
    this.setupStateListener();
    this.setupEventHandlers();
    this.actor.start();
  }

  private get state(): BotState {
    return this.actor.getSnapshot().value as BotState;
  }

  private setupStateListener(): void {
    this.actor.subscribe((snapshot) => {
      const state = snapshot.value as BotState;

      switch (state) {
        case 'waiting_for_login':
          log.warn('Please log in manually in the browser');
          log.dim('Waiting for login to complete...');
          break;
        case 'selecting_class':
          if (this.startupComplete) {
            log.success('Ready to select a class');
            log.info('Navigate to a class to start auto-answering');
          }
          break;
        case 'answering':
          log.success('Auto-answering started');
          break;
        case 'error':
          log.error(`Error: ${snapshot.context.error}`);
          break;
      }
    });
  }

  private setupEventHandlers(): void {
    events.on('page:navigated', async () => {
      if (!this.startupComplete || !this.pageListener) return;

      const isLoggedIn = await this.pageListener.isLoggedIn();
      const needsLogin = await this.pageListener.checkLoginState();

      if (this.state === 'waiting_for_login' && isLoggedIn) {
        this.actor.send({ type: 'LOGGED_IN' });
      }

      if ((this.state === 'selecting_class' || this.state === 'answering') && needsLogin) {
        this.actor.send({ type: 'LOGIN_REQUIRED' });
      }
    });
  }

  async start(): Promise<void> {
    // Launch browser
    this.actor.send({ type: 'LAUNCH' });
    const launchSpinner = spinner('Launching Chrome...');

    const launched = await this.browser.launch();
    if (!launched) {
      launchSpinner.fail('Failed to launch Chrome');
      this.actor.send({ type: 'FAIL', error: 'Failed to launch Chrome' });
      return;
    }
    launchSpinner.succeed('Chrome launched');

    // Connect via CDP
    this.actor.send({ type: 'SUCCESS' });
    const connectSpinner = spinner('Connecting via CDP...');

    const connected = await this.browser.connect();
    if (!connected) {
      connectSpinner.fail('Failed to connect');
      this.actor.send({ type: 'FAIL', error: 'Failed to connect' });
      return;
    }
    connectSpinner.succeed('Connected');

    // Navigate to target
    this.actor.send({ type: 'SUCCESS' });
    const navSpinner = spinner('Navigating to TopHat...');
    const navigated = await this.browser.navigate(config.targetUrl);
    if (!navigated) {
      navSpinner.fail('Failed to navigate');
      this.actor.send({ type: 'FAIL', error: 'Failed to navigate' });
      return;
    }
    navSpinner.succeed('Navigated to TopHat');

    // Setup page listener
    if (this.browser.page) {
      this.pageListener = new PageListener(this.browser.page);
      this.pageListener.start();
    }

    // Check if we need to login
    const needsLogin = this.pageListener && await this.pageListener.checkLoginState();
    this.startupComplete = true;

    if (needsLogin) {
      this.actor.send({ type: 'LOGIN_REQUIRED' });
    } else {
      this.actor.send({ type: 'READY' });
    }
  }

  async stop(): Promise<void> {
    this.actor.stop();
    this.pageListener?.stop();
    await this.browser.close();
    events.removeAllListeners();
  }

  get page() {
    return this.browser.page;
  }

  get currentState() {
    return this.state;
  }
}