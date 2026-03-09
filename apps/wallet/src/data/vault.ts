import {
  decryptWithDetail,
  decryptWithKey,
  type EncryptionResult,
  encryptWithDetail,
  encryptWithKey,
  importKey,
} from '@metamask/browser-passworder'
import { storage } from '@wxt-dev/storage'

const VAULT_DATA_KEY = 'local:vault:data' as const
const SESSION_EXPORTED_KEY = 'session:vault:exportedKey' as const
const SESSION_SALT_KEY = 'session:vault:salt' as const

export type VaultSecrets = {
  wallets: Record<
    string,
    {
      type: 'mnemonic' | 'privateKey'
      secret: string
    }
  >
}

export async function encryptAndStore(
  password: string,
  secrets: VaultSecrets,
): Promise<void> {
  const { vault, exportedKeyString } = await encryptWithDetail(
    password,
    secrets,
  )
  await storage.setItem(VAULT_DATA_KEY, vault)
  const payload = JSON.parse(vault) as EncryptionResult
  await storage.setItem(SESSION_EXPORTED_KEY, exportedKeyString)
  await storage.setItem(SESSION_SALT_KEY, payload.salt ?? '')
}

export async function decryptWithPassword(
  password: string,
): Promise<VaultSecrets> {
  const vault = await storage.getItem<string>(VAULT_DATA_KEY)
  if (!vault) throw new Error('No vault found')
  const {
    vault: secrets,
    exportedKeyString,
    salt,
  } = await decryptWithDetail(password, vault)
  await storage.setItem(SESSION_EXPORTED_KEY, exportedKeyString)
  await storage.setItem(SESSION_SALT_KEY, salt)
  return secrets as VaultSecrets
}

export async function decryptWithSession(): Promise<VaultSecrets> {
  const exportedKeyString = await storage.getItem<string>(SESSION_EXPORTED_KEY)
  if (!exportedKeyString) throw new Error('Wallet Locked')
  const vault = await storage.getItem<string>(VAULT_DATA_KEY)
  if (!vault) throw new Error('No vault found')
  const key = await importKey(exportedKeyString)
  const payload = JSON.parse(vault) as EncryptionResult
  return decryptWithKey(key, payload) as Promise<VaultSecrets>
}

export async function reEncryptWithSession(
  secrets: VaultSecrets,
): Promise<void> {
  const exportedKeyString = await storage.getItem<string>(SESSION_EXPORTED_KEY)
  const salt = await storage.getItem<string>(SESSION_SALT_KEY)
  if (!exportedKeyString) throw new Error('Wallet Locked')
  const key = await importKey(exportedKeyString)
  const encryptedData = await encryptWithKey(key, secrets)
  const vault = JSON.stringify({ ...encryptedData, salt: salt ?? '' })
  await storage.setItem(VAULT_DATA_KEY, vault)
}

export async function hasSession(): Promise<boolean> {
  const key = await storage.getItem<string>(SESSION_EXPORTED_KEY)
  return key != null && key !== ''
}

export async function clearSession(): Promise<void> {
  await storage.removeItem(SESSION_EXPORTED_KEY)
  await storage.removeItem(SESSION_SALT_KEY)
}

export async function hasVault(): Promise<boolean> {
  const data = await storage.getItem<string>(VAULT_DATA_KEY)
  return data != null && data !== ''
}
