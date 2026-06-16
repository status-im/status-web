import fs from 'node:fs'
import path from 'node:path'

interface StxPatchPattern {
  name: string
  detect: RegExp
  transform: (content: string) => string
  reverseTransform: (content: string) => string
}

const stxPatchedFiles: Array<{ path: string; original: string }> = []

// Category A: property value patterns (stable — these are serialized storage keys).
// Category B: publish hook patterns (fragile — depend on Terser output shape).
// If B breaks on MetaMask update, SW fetch interceptor handles STX as fallback.
const STX_PATTERNS: StxPatchPattern[] = [
  // --- Category A: Property value patterns ---
  {
    name: 'STX opt-in default',
    detect: /smartTransactionsOptInStatus:![01]/,
    transform: content =>
      content.replace(
        /smartTransactionsOptInStatus:![01]/g,
        'smartTransactionsOptInStatus:!1',
      ),
    reverseTransform: content =>
      content.replace(
        /smartTransactionsOptInStatus:!1/g,
        'smartTransactionsOptInStatus:!0',
      ),
  },
  {
    name: 'TX simulations default',
    detect: /useTransactionSimulations:![01]/,
    transform: content =>
      content.replace(
        /useTransactionSimulations:![01]/g,
        'useTransactionSimulations:!1',
      ),
    reverseTransform: content =>
      content.replace(
        /useTransactionSimulations:!1/g,
        'useTransactionSimulations:!0',
      ),
  },
  {
    name: 'STX opt-in nullish coalescing fallback',
    detect: /smartTransactionsOptInStatus\)\?\?![01]/,
    transform: content =>
      content.replace(
        /smartTransactionsOptInStatus\)\?\?![01]/g,
        'smartTransactionsOptInStatus)??!1',
      ),
    reverseTransform: content =>
      content.replace(
        /smartTransactionsOptInStatus\)\?\?!1/g,
        'smartTransactionsOptInStatus)??!0',
      ),
  },

  // --- Category B: Publish hook patterns ---
  {
    name: 'STX single-tx publish hook',
    detect:
      /(?:isSmartTransaction:\w+,featureFlags:\w+\}[^;]*getSmartTransactionCommonParams|featureFlags:\w+\}[^;]*getSmartTransactionCommonParams[^;]*\w+=!1,\w+=await)/,
    transform: content =>
      content.replace(
        /const\{isSmartTransaction:(\w+),featureFlags:(\w+)\}=\(0,(\w+)\.getSmartTransactionCommonParams\)\((\w+),(\w+)\.chainId\),(\w+)=await\(0,(\w+)\.isSendBundleSupported\)/g,
        'const{featureFlags:$2}=(0,$3.getSmartTransactionCommonParams)($4,$5.chainId),$1=!1,$6=await(0,$7.isSendBundleSupported)',
      ),
    reverseTransform: content =>
      content.replace(
        /const\{featureFlags:(\w+)\}=\(0,(\w+)\.getSmartTransactionCommonParams\)\((\w+),(\w+)\.chainId\),(\w+)=!1,(\w+)=await\(0,(\w+)\.isSendBundleSupported\)/g,
        'const{isSmartTransaction:$5,featureFlags:$1}=(0,$2.getSmartTransactionCommonParams)($3,$4.chainId),$6=await(0,$7.isSendBundleSupported)',
      ),
  },
  {
    name: 'STX batch-tx publish hook',
    detect:
      /isSmartTransaction:\w+,featureFlags:\w+\}[^;]*getSmartTransactionCommonParams[^;]*;return (?:\w+|!1)\?/,
    transform: content =>
      content.replace(
        /const\{isSmartTransaction:(\w+),featureFlags:(\w+)\}=\(0,(\w+)\.getSmartTransactionCommonParams\)\((\w+),(\w+)\.chainId\);return \1\?/g,
        'const{isSmartTransaction:$1,featureFlags:$2}=(0,$3.getSmartTransactionCommonParams)($4,$5.chainId);return !1?',
      ),
    reverseTransform: content =>
      content.replace(
        /const\{isSmartTransaction:(\w+),featureFlags:(\w+)\}=\(0,(\w+)\.getSmartTransactionCommonParams\)\((\w+),(\w+)\.chainId\);return !1\?/g,
        'const{isSmartTransaction:$1,featureFlags:$2}=(0,$3.getSmartTransactionCommonParams)($4,$5.chainId);return $1?',
      ),
  },
]

/**
 * Disable Smart Transactions by patching extension JS files.
 * STX routes txs through MetaMask's relay → breaks Anvil (txs stay "Pending" forever).
 */
export function disableSmartTransactionsInFiles(extensionPath: string): void {
  console.log('[anvil-fixture] Patching MetaMask extension for STX disable...')

  const jsFiles = fs
    .readdirSync(extensionPath)
    .filter(f => f.endsWith('.js'))
    .sort()

  const patternMatchCounts = new Map<string, number>(
    STX_PATTERNS.map(p => [p.name, 0]),
  )

  for (const fileName of jsFiles) {
    const filePath = path.join(extensionPath, fileName)
    const content = fs.readFileSync(filePath, 'utf-8')

    const applicable = STX_PATTERNS.filter(p => p.detect.test(content))
    if (applicable.length === 0) continue

    // Reverse stale patches → re-apply fresh (idempotent)
    let trueOriginal = content
    for (const p of applicable) {
      trueOriginal = p.reverseTransform(trueOriginal)
    }

    let patched = trueOriginal
    for (const p of applicable) {
      patched = p.transform(patched)
    }

    const patchNames = applicable.map(p => p.name).join(', ')

    if (patched !== content) {
      stxPatchedFiles.push({ path: filePath, original: trueOriginal })
      fs.writeFileSync(filePath, patched)
      for (const p of applicable) {
        patternMatchCounts.set(
          p.name,
          (patternMatchCounts.get(p.name) ?? 0) + 1,
        )
      }
      if (trueOriginal !== content) {
        console.log(`[anvil-fixture] ${fileName}: ${patchNames} - RE-PATCHED`)
      } else {
        console.log(`[anvil-fixture] ${fileName}: ${patchNames} - PATCHED`)
      }
    } else if (trueOriginal !== content) {
      stxPatchedFiles.push({ path: filePath, original: trueOriginal })
      for (const p of applicable) {
        patternMatchCounts.set(
          p.name,
          (patternMatchCounts.get(p.name) ?? 0) + 1,
        )
      }
      console.log(
        `[anvil-fixture] ${fileName}: ${patchNames} - ALREADY PATCHED`,
      )
    }
  }

  for (const [name, count] of patternMatchCounts) {
    if (count === 0) {
      console.warn(
        `[anvil-fixture] WARNING: pattern "${name}" matched 0 files. ` +
          'MetaMask version may have changed. SW fetch interceptor will handle STX as fallback.',
      )
    }
  }

  console.log(
    `[anvil-fixture] STX patch complete: ${stxPatchedFiles.length} file(s) recorded for restore`,
  )
}

export function restoreSmartTransactionsFiles(): void {
  for (const { path: filePath, original } of stxPatchedFiles) {
    fs.writeFileSync(filePath, original)
  }
  stxPatchedFiles.length = 0
}
