import { test as base } from '@playwright/test';
import { PreDepositsPage } from '../pages/hub/pre-deposits.page.js';
import { SidebarComponent } from '../pages/hub/components/sidebar.component.js';

interface HubFixtures {
  preDepositsPage: PreDepositsPage;
  sidebar: SidebarComponent;
}

export const test = base.extend<HubFixtures>({
  preDepositsPage: async ({ page }, use) => {
    await use(new PreDepositsPage(page));
  },
  sidebar: async ({ page }, use) => {
    await use(new SidebarComponent(page));
  },
});

export { expect } from '@playwright/test';
