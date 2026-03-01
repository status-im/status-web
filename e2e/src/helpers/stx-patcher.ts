import fs from 'node:fs'
import path from 'node:path'

/**
 * A pattern that can be applied to MetaMask compiled JS files to disable
 * Smart Transactions. Each pattern has a forward transform (apply patch)
 * and a reverse transform (recover true original from already-patched files).
 */
interface StxPatchPattern {
  /** Human-readable name for logging */
  name: string
  /** Detect whether this pattern is present (original or already-patched form) */
  detect: RegExp
  /** Apply the patch: original → patched */
  transform: (content: string) => string
  /** Reverse the patch: patched → original (for idempotent re-patching) */
  reverseTransform: (content: string) => string
}

// Track files patched for Smart Transactions disabling
const stxPatchedFiles: Array<{ path: string; original: string }> = []

/**
 * STX patch patterns.
 *
 * Category A — Property value patterns (STABLE):
 *   Use full MetaMask preference key names (`smartTransactionsOptInStatus`,
 *   `useTransactionSimulations`). These survive minification because they are
 *   serialized state keys persisted to extension storage.
 *
 * Category B — Publish hook patterns (FRAGILE-STRUCTURE):
 *   Match the code structure of MetaMask's STX publish hooks. Use capture
 *   groups for minified variable names, but depend on the exact Terser output
 *   shape. If these fail to match on a MetaMask update, the SW fetch
 *   interceptor (service-worker-patch.ts) serves as a complete fallback.
 */
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
  // These match the destructuring of getSmartTransactionCommonParams and force
  // isSmartTransaction to false. Method names are semantic (from
  // @metamask/smart-transactions-controller) but the code structure is fragile.
  // If these break on a MetaMask update, the SW fetch interceptor handles STX.
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
 * Disable MetaMask's Smart Transactions by patching extension source files.
 * Smart Transactions routes txs through MetaMask's relay service, which breaks
 * Anvil-based testing (txs confirmed on Anvil appear as "Pending" forever).
 *
 * We can't use MetaMask's UI to toggle the setting because:
 * - page.goto() causes MetaMask to lock (shows "Enter your password")
 * - page.evaluate() is blocked by LavaMoat's scuttling mode
 *
 * Instead, we patch the compiled JS files to set the default opt-in to false
 * BEFORE the browser reads them. Files are restored in cleanup.
 *
 * **Resilience:** Instead of targeting hardcoded chunk filenames (which change
 * between MetaMask versions), we scan ALL .js files in the extension directory
 * and apply patterns to every file that matches. Even if ALL patterns fail to
 * match (e.g. after a major MetaMask update), the SW fetch interceptor in
 * service-worker-patch.ts intercepts STX API traffic as a complete fallback.
 *
 * Patches are idempotent: they match both the original (!0) and already-patched
 * (!1) values. If a previous run crashed without restoring, the file is already
 * in the target state and the "true original" is recovered via reverse transform.
 */
export function disableSmartTransactionsInFiles(extensionPath: string): void {
  console.log('[anvil-fixture] Patching MetaMask extension for STX disable...')

  // Scan all JS files in the extension root (MetaMask puts compiled chunks here)
  const jsFiles = fs
    .readdirSync(extensionPath)
    .filter(f => f.endsWith('.js'))
    .sort()

  // Track which patterns matched at least once (for diagnostics)
  const patternMatchCounts = new Map<string, number>(
    STX_PATTERNS.map(p => [p.name, 0]),
  )

  for (const fileName of jsFiles) {
    const filePath = path.join(extensionPath, fileName)
    const content = fs.readFileSync(filePath, 'utf-8')

    // Find which patterns apply to this file
    const applicable = STX_PATTERNS.filter(p => p.detect.test(content))
    if (applicable.length === 0) continue

    // Reverse any stale patches, then re-apply fresh ones
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

  // Warn about patterns that didn't match any file
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

/** Restore all files patched by disableSmartTransactionsInFiles */
export function restoreSmartTransactionsFiles(): void {
  for (const { path: filePath, original } of stxPatchedFiles) {
    fs.writeFileSync(filePath, original)
  }
  stxPatchedFiles.length = 0
}
