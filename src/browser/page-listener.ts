import type { Page } from 'playwright';
import { config } from '../config';
import { events } from '../events/emitter';

export class PageListener {
  private page: Page;
  private lastUrl: string = '';

  constructor(page: Page) {
    this.page = page;
  }

  start(): void {
    // Listen for navigation
    this.page.on('framenavigated', async (frame) => {
      if (frame !== this.page.mainFrame()) return;

      const url = frame.url();
      if (url === this.lastUrl) return;
      this.lastUrl = url;

      events.emit({ type: 'page:navigated', url });

      // Check if this is a login page
      if (this.isLoginUrl(url)) {
        events.emit({ type: 'page:login_detected' });
      }
    });

    // Listen for URL changes (SPA navigation)
    this.page.on('load', async () => {
      const url = this.page.url();
      if (this.isLoginUrl(url)) {
        events.emit({ type: 'page:login_detected' });
      }
    });
  }

  private isLoginUrl(url: string): boolean {
    return config.loginUrlPattern.test(url);
  }

  isOnTargetDomain(): boolean {
    const url = this.page.url();
    return url.includes('tophat.com');
  }

  async checkLoginState(): Promise<boolean> {
    const url = this.page.url();
    // If not on TopHat domain, assume we need login (SSO redirect)
    if (!this.isOnTargetDomain()) {
      return true;
    }
    return this.isLoginUrl(url);
  }

  async isLoggedIn(): Promise<boolean> {
    // Must be on TopHat domain AND not on a login URL
    return this.isOnTargetDomain() && !this.isLoginUrl(this.page.url());
  }

  stop(): void {
    this.page.removeAllListeners();
  }
}
