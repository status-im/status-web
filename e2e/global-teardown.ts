import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

async function globalTeardown(): Promise<void> {
  console.log('[global-teardown] Cleaning up temporary files...');

  const tmpDir = os.tmpdir();
  let cleaned = 0;

  try {
    const entries = fs.readdirSync(tmpDir).filter(e => e.startsWith('pw-metamask-'));
    for (const entry of entries) {
      const fullPath = path.join(tmpDir, entry);
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        cleaned++;
      } catch {
        // Ignore cleanup errors for individual profiles
      }
    }
  } catch {
    // Ignore errors reading tmpdir
  }

  if (cleaned > 0) {
    console.log(`[global-teardown] Removed ${cleaned} temporary browser profile(s).`);
  }

  console.log('[global-teardown] Cleanup complete.');
}

export default globalTeardown;
