import {
  clearSession,
  decryptWithPassword,
  decryptWithSession,
  encryptAndStore,
  hasSession,
  hasVault,
  reEncryptWithSession,
  type VaultSecrets,
} from './vault'
import * as walletMetadata from './wallet-metadata'

import type { WalletAccount } from './wallet-metadata'

export const INACTIVITY_ALARM_NAME = 'wallet-inactivity-timer'
const INACTIVITY_DELAY_MINUTES = 15
// BIP-44 first Ethereum account, used when legacy KeyStore account has no derivationPath
const FALLBACK_DERIVATION_PATH = "m/44'/60'/0'/0/0"

type LegacyAccount = {
  address: string
  coin?: number
  derivationPath?: string
  derivation?: number
}
type LegacyWallet = {
  id: string
  name: string
  activeAccounts?: LegacyAccount[]
}

export async function unlock(password: string): Promise<void> {
  if (await hasVault()) {
    await decryptWithPassword(password)
  } else {
    await migrateFromLegacy(password)
  }
  await resetInactivityTimer()
}

async function migrateFromLegacy(password: string): Promise<void> {
  const { getKeystore } = await import('./keystore')
  const keyStore = await getKeystore()
  const wallets = (await keyStore.loadAll()) as LegacyWallet[]
  const secrets: VaultSecrets = { wallets: {} }
  for (const w of wallets) {
    try {
      const secret = (await keyStore.export(w.id, password)) as string
      secrets.wallets[w.id] = { type: 'mnemonic', secret }
      const activeAccounts: WalletAccount[] = (w.activeAccounts ?? []).map(
        a => ({
          address: a.address,
          coin: a.coin ?? 60,
          derivationPath: a.derivationPath ?? FALLBACK_DERIVATION_PATH,
          derivation: a.derivation ?? 0,
        }),
      )
      await walletMetadata.save({
        id: w.id,
        name: w.name,
        type: 'mnemonic',
        activeAccounts,
      })
    } catch {
      // skip wallet if export fails (e.g. wrong password)
    }
  }
  if (Object.keys(secrets.wallets).length === 0)
    throw new Error('No vault found')
  await encryptAndStore(password, secrets)
  // todo?: uncomment following lines - optional cleanup for legacy wallets
  // const { storage } = await import('@wxt-dev/storage')
  // await storage.removeItem('local:status:all-wallet-ids')
  // for (const w of wallets) {
  //   await storage.removeItem(`local:status:${w.id}`)
  // }
}

export async function lock(): Promise<void> {
  await clearSession()
  await chrome.alarms.clear(INACTIVITY_ALARM_NAME)
}

export async function isUnlocked(): Promise<boolean> {
  return hasSession()
}

export async function getMnemonic(walletId: string): Promise<string> {
  const secrets = await decryptWithSession()
  const entry = secrets.wallets[walletId]
  if (!entry) throw new Error(`Wallet ${walletId} not found`)
  if (entry.type !== 'mnemonic') throw new Error('Wallet is not mnemonic type')
  return entry.secret
}

export async function getPrivateKeyData(walletId: string): Promise<string> {
  const secrets = await decryptWithSession()
  const entry = secrets.wallets[walletId]
  if (!entry) throw new Error(`Wallet ${walletId} not found`)
  if (entry.type !== 'privateKey')
    throw new Error('Wallet is not private key type')
  return entry.secret
}

export async function resetInactivityTimer(): Promise<void> {
  await chrome.alarms.create(INACTIVITY_ALARM_NAME, {
    delayInMinutes: INACTIVITY_DELAY_MINUTES,
  })
}

export async function addWalletToVault(
  walletId: string,
  type: 'mnemonic' | 'privateKey',
  secret: string,
): Promise<void> {
  const secrets = await decryptWithSession()
  secrets.wallets[walletId] = { type, secret }
  await reEncryptWithSession(secrets)
}

export async function removeWalletFromVault(walletId: string): Promise<void> {
  const secrets = await decryptWithSession()
  delete secrets.wallets[walletId]
  await reEncryptWithSession(secrets)
}
