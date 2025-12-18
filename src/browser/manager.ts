import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import type { Browser, BrowserContext, Page } from 'playwright';
import { config } from '../config';
import { events } from '../events/emitter';

chromium.use(stealth());

export class BrowserManager {
  private chrome: chromeLauncher.LaunchedChrome | null = null;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private _page: Page | null = null;

  get page(): Page | null {
    return this._page;
  }

  async launch(): Promise<boolean> {
    try {
      this.chrome = await chromeLauncher.launch({
        port: config.cdpPort,
        chromeFlags: config.chromeFlags,
      });
      events.emit({ type: 'browser:launched' });
      return true;
    } catch (error) {
      events.emit({ type: 'browser:error', error: error as Error });
      return false;
    }
  }

  async connect(): Promise<boolean> {
    try {
      this.browser = await chromium.connectOverCDP(`http://localhost:${config.cdpPort}`);
      this.context = this.browser.contexts()[0];
      this._page = await this.context.newPage();
      events.emit({ type: 'browser:connected' });
      return true;
    } catch (error) {
      events.emit({ type: 'browser:error', error: error as Error });
      return false;
    }
  }

  async navigate(url: string): Promise<boolean> {
    if (!this._page) return false;
    try {
      await this._page.goto(url);
      events.emit({ type: 'page:navigated', url });
      return true;
    } catch (error) {
      events.emit({ type: 'page:error', error: error as Error });
      return false;
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    if (this.chrome) {
      this.chrome.kill();
      this.chrome = null;
    }
    events.emit({ type: 'browser:disconnected' });
  }
}
