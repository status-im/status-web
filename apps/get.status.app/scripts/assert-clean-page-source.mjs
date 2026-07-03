import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const appRoot = resolve(import.meta.dirname, '..')

const filesToScan = [
  'messages/en.json',
  'src/app/layout.tsx',
  'src/app/[locale]/(website)/page.tsx',
  '../status.app/src/app/(website)/page.tsx',
  '../status.app/src/app/(website)/apps/page.tsx',
  '../status.app/src/app/(website)/_components/footer/index.tsx',
  '../status.app/src/app/(website)/_components/hands-section.tsx',
  '../status.app/src/app/(website)/_components/download-connector.tsx',
  '../status.app/src/app/(website)/_components/download-connector-dialog.tsx',
].map(file => resolve(appRoot, file))

const blockedPatterns = [
  /Messari Transparency Verified/i,
  /Own cryptocurrency/i,
  /decentralized finance tools/i,
  /Web3 Wallet/i,
  /Status Wallet Connector/i,
  /Connector_NOCRYPTO/i,
  /Connector_NoCrypto/i,
  /Animation_Privacy_Frame/i,
  /SSign up/i,
  /id:\s*'get\.status\.app\/Hero_app:1267:770'/i,
  /Desktop_Wallet_function/i,
  /wallet feature/i,
  /twitter:site/i,
  /@ethstatus/i,
]

const failures = []

for (const file of filesToScan) {
  const content = readFileSync(file, 'utf8').replace(
    /isGetSite\s*\?\s*(['"`][^'"`]*['"`])\s*:\s*(['"`][^'"`]*['"`])/g,
    '$1',
  )

  for (const pattern of blockedPatterns) {
    if (pattern.test(content)) {
      failures.push(`${relative(appRoot, file)} contains ${pattern}`)
    }
  }
}

if (failures.length > 0) {
  console.error('get.status.app page-source cleanup failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}
