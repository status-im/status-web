import { storage } from '@wxt-dev/storage'

const VAULT_METADATA_KEY = 'local:vault:metadata' as const

export type WalletAccount = {
  address: string
  coin: number
  derivationPath: string
  derivation: number
}

export type WalletMeta = {
  id: string
  name: string
  type: 'mnemonic' | 'privateKey'
  activeAccounts: WalletAccount[]
}

type MetadataStore = Record<string, WalletMeta>

async function getStore(): Promise<MetadataStore> {
  const data = await storage.getItem<string>(VAULT_METADATA_KEY)
  if (!data) return {}
  return JSON.parse(data) as MetadataStore
}

async function setStore(store: MetadataStore): Promise<void> {
  await storage.setItem(VAULT_METADATA_KEY, JSON.stringify(store))
}

export async function getAll(): Promise<WalletMeta[]> {
  const store = await getStore()
  return Object.values(store)
}

export async function get(walletId: string): Promise<WalletMeta | null> {
  const store = await getStore()
  return store[walletId] ?? null
}

export async function save(wallet: WalletMeta): Promise<void> {
  const store = await getStore()
  store[wallet.id] = wallet
  await setStore(store)
}

export async function addAccount(
  walletId: string,
  account: WalletAccount,
): Promise<void> {
  const wallet = await get(walletId)
  if (!wallet) throw new Error(`Wallet ${walletId} not found`)
  if (wallet.activeAccounts.some(a => a.address === account.address)) return
  wallet.activeAccounts.push(account)
  await save(wallet)
}

export async function remove(walletId: string): Promise<void> {
  const store = await getStore()
  delete store[walletId]
  await setStore(store)
}
