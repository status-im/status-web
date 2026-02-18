import type { BrowserContext, Page } from '@playwright/test';
import { NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js';

/**
 * MetaMask Settings page object.
 * Handles network RPC configuration for Anvil forks.
 *
 * Tested with MetaMask v13.16.3.
 */
export class MetaMaskSettingsPage {
  constructor(
    private readonly context: BrowserContext,
    private readonly extensionId: string,
  ) {}

  private get baseUrl(): string {
    return `chrome-extension://${this.extensionId}/home.html`;
  }

  /**
   * Add a custom RPC endpoint to an existing network via MetaMask Settings UI.
   *
   * MetaMask v13 allows multiple RPC endpoints per network. This method adds
   * a new RPC URL to the specified network (e.g., Ethereum Mainnet → localhost:8547).
   *
   * Flow:
   * 1. Open MetaMask Settings → Networks
   * 2. Click on the target network
   * 3. Add the custom RPC URL
   * 4. Save
   */
  async addCustomRpcToNetwork(networkName: string, rpcUrl: string): Promise<void> {
    const page = await this.openSettingsPage();

    // Navigate to Networks settings
    await page.goto(`${this.baseUrl}#settings/networks`);
    await page.waitForLoadState('domcontentloaded');

    // Click on the target network in the list
    const networkItem = page.getByText(networkName, { exact: false }).first();
    await networkItem.click({ timeout: NOTIFICATION_TIMEOUTS.ELEMENT_VISIBLE });

    // Look for "Add RPC URL" or similar button in the network details
    const addRpcButton = page
      .getByRole('button', { name: /add.*rpc|add.*url|add a custom network rpc/i })
      .or(page.getByText(/add.*rpc.*url/i));

    const hasAddRpc = await addRpcButton
      .isVisible({ timeout: NOTIFICATION_TIMEOUTS.OPTIONAL_ELEMENT })
      .catch(() => false);

    if (hasAddRpc) {
      await addRpcButton.click();
    }

    // Find the RPC URL input field and fill it
    // MetaMask uses various test IDs and input types — try multiple selectors
    const rpcInput = page
      .getByTestId('rpc-url-input-test')
      .or(page.getByPlaceholder(/rpc.*url|https:\/\//i))
      .or(page.locator('input[name="rpcUrl"]'))
      .or(page.locator('.networks-tab__rpc-url input'));

    await rpcInput.fill(rpcUrl);

    // Save the configuration
    const saveButton = page.getByRole('button', { name: /save|add url|confirm/i });
    await saveButton.click({ timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION });

    // Wait for save to complete
    await page.waitForTimeout(1000);
  }

  /**
   * Alternative approach: Add a custom network via wallet_addEthereumChain RPC call.
   *
   * For non-built-in chains (Linea, custom chains), this works directly.
   * For built-in chains (Ethereum Mainnet, chainId 1), MetaMask may reject this.
   *
   * @returns true if the RPC call succeeded, false if MetaMask rejected it
   */
  async tryAddNetworkViaRpc(
    dAppPage: Page,
    params: {
      chainId: string;
      chainName: string;
      rpcUrl: string;
      currencySymbol?: string;
      blockExplorerUrl?: string;
    },
  ): Promise<boolean> {
    const result = await dAppPage.evaluate(async (p) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (window as any).ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: p.chainId,
            chainName: p.chainName,
            rpcUrls: [p.rpcUrl],
            nativeCurrency: {
              name: p.currencySymbol === 'ETH' ? 'Ether' : p.currencySymbol,
              symbol: p.currencySymbol || 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: p.blockExplorerUrl ? [p.blockExplorerUrl] : undefined,
          }],
        });
        return { success: true };
      } catch (e) {
        return { success: false, error: String(e) };
      }
    }, params);

    if (result.success) return true;

    // If a MetaMask popup appeared, approve it
    const notifPage = this.context
      .pages()
      .find(p => {
        try {
          const url = new URL(p.url());
          return url.host === this.extensionId && url.pathname.includes('notification.html');
        } catch {
          return false;
        }
      });

    if (notifPage) {
      const approveButton = notifPage.getByRole('button', { name: /approve|confirm/i });
      if (await approveButton.isVisible({ timeout: NOTIFICATION_TIMEOUTS.OPTIONAL_ELEMENT }).catch(() => false)) {
        await approveButton.click();
        return true;
      }
    }

    return false;
  }

  private async openSettingsPage(): Promise<Page> {
    let mmPage = this.context
      .pages()
      .find(p => p.url().startsWith(`chrome-extension://${this.extensionId}`));

    if (!mmPage) {
      mmPage = await this.context.newPage();
    }

    await mmPage.goto(`${this.baseUrl}#settings`);
    await mmPage.waitForLoadState('domcontentloaded');
    return mmPage;
  }
}
