import { expect, type Locator, type Page } from '@playwright/test';

export class SidebarComponent {
  constructor(private readonly page: Page) {}

  get homeLink(): Locator {
    return this.page.getByRole('link', { name: /home/i }).first();
  }

  get preDepositsLink(): Locator {
    return this.page.getByRole('link', { name: /pre.deposit/i }).first();
  }

  get stakeLink(): Locator {
    return this.page.getByRole('link', { name: /stake/i }).first();
  }

  get discoverLink(): Locator {
    return this.page.getByRole('link', { name: /discover/i }).first();
  }

  get karmaLink(): Locator {
    return this.page.getByRole('link', { name: /karma/i }).first();
  }

  async navigateToHome(): Promise<void> {
    await this.homeLink.click();
    await expect(this.page).toHaveURL(/\/$/);
  }

  async navigateToPreDeposits(): Promise<void> {
    await this.preDepositsLink.click();
    await expect(this.page).toHaveURL(/\/pre-deposits/);
  }

  async navigateToStake(): Promise<void> {
    await this.stakeLink.click();
    await expect(this.page).toHaveURL(/\/stake/);
  }

  async navigateToDiscover(): Promise<void> {
    await this.discoverLink.click();
    await expect(this.page).toHaveURL(/\/discover/);
  }

  async navigateToKarma(): Promise<void> {
    await this.karmaLink.click();
    await expect(this.page).toHaveURL(/\/karma/);
  }
}
