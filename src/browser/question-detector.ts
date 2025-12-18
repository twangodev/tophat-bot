import type { Page } from 'playwright';
import { events } from '../events/emitter';

export class QuestionDetector {
  private page: Page;
  private watching = false;

  constructor(page: Page) {
    this.page = page;
  }

  async startWatching(): Promise<void> {
    if (this.watching) return;
    this.watching = true;

    while (this.watching) {
      try {
        // Wait for toast to appear (event-driven, not polling)
        await this.page.waitForSelector('#tophat\\.new-question-item-notification', {
          state: 'attached',
          timeout: 0, // Wait indefinitely
        });

        if (!this.watching) break;

        const openBtn = await this.page.$('#tophat\\.new-question-item-notification button:has-text("Open")');
        if (openBtn) {
          events.emit({ type: 'question:detected' });
          await openBtn.click();
          // Wait for question form to load
          await this.page.waitForSelector('form.question-renderer-container', { timeout: 5000 });
        }
      } catch {
        // Selector wait was interrupted or timed out
        if (!this.watching) break;
      }
    }
  }

  stopWatching(): void {
    this.watching = false;
  }

  async hasActiveQuestion(): Promise<boolean> {
    const form = await this.page.$('form.question-renderer-container');
    return form !== null;
  }
}
