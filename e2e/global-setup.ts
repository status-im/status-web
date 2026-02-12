import fs from 'node:fs';
import path from 'node:path';
import { loadEnvConfig } from './src/config/env.js';

async function globalSetup(): Promise<void> {
  console.log('[global-setup] Validating environment...');

  const env = loadEnvConfig();

  // Validate MetaMask extension is present
  if (!fs.existsSync(env.METAMASK_EXTENSION_PATH)) {
    console.warn(
      `[global-setup] MetaMask extension not found at: ${env.METAMASK_EXTENSION_PATH}\n` +
        `Run "pnpm setup:metamask" to download it.\n` +
        `Wallet-dependent tests will fail.`,
    );
  }

  // Warn about missing seed phrase
  if (!env.WALLET_SEED_PHRASE) {
    console.warn(
      '[global-setup] WALLET_SEED_PHRASE is not set. ' +
        'Wallet-dependent tests will fail. ' +
        'Set it in .env or .env.local.',
    );
  }

  // Ensure output directories exist
  const outputDir = path.resolve(import.meta.dirname, 'test-results');
  fs.mkdirSync(path.join(outputDir, 'html-report'), { recursive: true });
  fs.mkdirSync(path.join(outputDir, 'traces'), { recursive: true });

  console.log('[global-setup] Environment validated.');
  console.log(`[global-setup] Base URL: ${env.BASE_URL}`);
  console.log(
    `[global-setup] MetaMask: ${fs.existsSync(env.METAMASK_EXTENSION_PATH) ? 'found' : 'NOT found'}`,
  );
}

export default globalSetup;
