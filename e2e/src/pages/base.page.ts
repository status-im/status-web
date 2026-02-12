import type { Locator, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to this page's path */
  abstract goto(): Promise<void>;

  /** Wait for the page to be fully loaded (override per page) */
  abstract waitForReady(): Promise<void>;

  /** Navigate and wait for ready state */
  async navigateAndWait(): Promise<void> {
    await this.goto();
    await this.waitForReady();
  }

  /** Get the page title */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /** Scroll element into view */
  protected async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }
}
