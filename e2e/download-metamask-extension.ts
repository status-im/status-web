import fs from 'node:fs';

import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const extensionId =
  process.env.METAMASK_EXTENSION_ID ?? 'nkbihfbeogaeaoehlefnkodbefgpgknn';
const chromeVersion = process.env.CHROME_VERSION ?? '131.0.0.0';
const destDir =
  process.env.METAMASK_EXTENSION_DEST ??
  path.resolve(process.cwd(), '.extensions', 'metamask');

const url = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=${chromeVersion}&acceptformat=crx2,crx3&x=id%3D${extensionId}%26installsource%3Dondemand%26uc`;

console.log(`Downloading MetaMask extension (${extensionId})...`);

const res = await fetch(url, {
  headers: { 'user-agent': 'Mozilla/5.0' },
});

if (!res.ok) {
  throw new Error(`Failed to download CRX: ${res.status} ${res.statusText}`);
}

const arrayBuffer = await res.arrayBuffer();
const crx = Buffer.from(arrayBuffer);

if (crx.slice(0, 4).toString('ascii') !== 'Cr24') {
  throw new Error('Not a CRX file. Download may have failed.');
}

const version = crx.readUInt32LE(4);
let headerLen = 0;

if (version === 2) {
  const pubLen = crx.readUInt32LE(8);
  const sigLen = crx.readUInt32LE(12);
  headerLen = 16 + pubLen + sigLen;
} else if (version === 3) {
  const headerSize = crx.readUInt32LE(8);
  headerLen = 12 + headerSize;
} else {
  throw new Error(`Unknown CRX version ${version}`);
}

const zipData = crx.slice(headerLen);
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'metamask-'));
const zipPath = path.join(tmpDir, 'metamask.zip');
fs.writeFileSync(zipPath, zipData);

fs.rmSync(destDir, { recursive: true, force: true });
fs.mkdirSync(destDir, { recursive: true });

const unzip = spawnSync('unzip', ['-o', zipPath, '-d', destDir], {
  stdio: 'inherit',
});

if (unzip.status !== 0) {
  throw new Error(
    'Failed to unzip extension. Make sure `unzip` is installed.',
  );
}

// Clean up temp files
fs.rmSync(tmpDir, { recursive: true, force: true });

console.log(`MetaMask extracted to: ${destDir}`);
