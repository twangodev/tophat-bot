import type { Page } from 'playwright';

export interface QuestionOption {
  letter: string;
  text: string;
  inputId: string;
}

export interface Question {
  type: 'multiple_choice' | 'unknown';
  text: string;
  options: QuestionOption[];
}

export class QuestionParser {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async parse(): Promise<Question | null> {
    const form = await this.page.$('form.question-renderer-container');
    if (!form) return null;

    // Get question text
    const questionEl = await form.$('.question-renderer-content-area > p');
    const questionText = questionEl ? await questionEl.textContent() || '' : '';

    // Check if multiple choice
    const radioInputs = await form.$$('input[type="radio"]');
    if (radioInputs.length > 0) {
      const options: QuestionOption[] = [];

      for (const input of radioInputs) {
        const ariaLabel = await input.getAttribute('aria-label') || '';
        const inputId = await input.getAttribute('id') || '';

        // aria-label format: "A, nahhh"
        const match = ariaLabel.match(/^([A-Z]),\s*(.+)$/);
        if (match) {
          options.push({
            letter: match[1],
            text: match[2],
            inputId,
          });
        }
      }

      return {
        type: 'multiple_choice',
        text: questionText.trim(),
        options,
      };
    }

    return {
      type: 'unknown',
      text: questionText.trim(),
      options: [],
    };
  }

  async selectOption(inputId: string): Promise<void> {
    const input = await this.page.$(`#${CSS.escape(inputId)}`);
    if (input) {
      await input.click();
    }
  }
}
