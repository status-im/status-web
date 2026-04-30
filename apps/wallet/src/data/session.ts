import { getKeystore } from './keystore'
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
  const vaultExists = await hasVault()
  if (vaultExists) {
    await decryptWithPassword(password)
  }

  // try migrating legacy wallets if there are any
  try {
    await migrateFromLegacy(password, vaultExists)
  } catch (err) {
    if (!vaultExists) throw err
    console.error('Legacy wallet migration failed:', err)
  }
  await resetInactivityTimer()
}

async function migrateFromLegacy(
  password: string,
  vaultExists: boolean,
): Promise<void> {
  const keyStore = await getKeystore()
  const wallets = (await keyStore.loadAll()) as LegacyWallet[]

  if (wallets.length === 0) {
    if (!vaultExists) throw new Error('No vault found')
    return
  }

  const secrets: VaultSecrets = vaultExists
    ? await decryptWithSession()
    : { wallets: {} }

  for (const w of wallets) {
    try {
      const secret = (await keyStore.export(w.id, password)) as string
      secrets.wallets[w.id] = { type: 'mnemonic', secret }
      const accounts: WalletAccount[] = (w.activeAccounts ?? []).map(a => ({
        address: a.address,
        coin: a.coin ?? 60,
        derivationPath: a.derivationPath ?? FALLBACK_DERIVATION_PATH,
        derivation: a.derivation ?? 0,
      }))
      await walletMetadata.save({
        id: w.id,
        name: w.name,
        type: 'mnemonic',
        accounts,
        selectedAccountAddress: accounts[0]?.address,
      })
      await keyStore.delete(w.id, password)
    } catch (err) {
      // skip wallet if export fails (e.g. wrong password)
      console.error(`Failed migrating wallet ${w.id}:`, err)
    }
  }

  if (Object.keys(secrets.wallets).length === 0)
    throw new Error('No vault found')

  if (vaultExists) {
    await reEncryptWithSession(secrets)
  } else {
    // ensure we have a vault
    await encryptAndStore(password, secrets)
  }
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
