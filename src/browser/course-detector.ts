import type { Page } from 'playwright';

export interface Course {
  name: string;
  id: string;
  url: string;
  professor: string;
}

export class CourseDetector {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async isOnLobby(): Promise<boolean> {
    const url = this.page.url();
    return url.includes('tophat.com/e') && !url.match(/\/e\/\d+/);
  }

  async getCourses(): Promise<Course[]> {
    const cards = await this.page.$$('li[class*="CourseCardstyles__CardContainer"]');
    const courses: Course[] = [];

    for (const card of cards) {
      const linkEl = await card.$('a[aria-label][href^="/e/"]');
      const profEl = await card.$('div[class*="CourseCardstyles__CardProfList"]');

      if (linkEl) {
        const name = await linkEl.getAttribute('aria-label') || '';
        const href = await linkEl.getAttribute('href') || '';
        const id = href.replace('/e/', '');
        const professor = profEl ? await profEl.textContent() || '' : '';

        courses.push({
          name,
          id,
          url: `https://app.tophat.com${href}`,
          professor: professor.trim(),
        });
      }
    }

    return courses;
  }
}