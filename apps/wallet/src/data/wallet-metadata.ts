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
  accounts: WalletAccount[]
  selectedAccountAddress?: string
}

type LegacyWalletMeta = {
  id: string
  name: string
  type: 'mnemonic' | 'privateKey'
  activeAccounts?: WalletAccount[]
  accounts?: WalletAccount[]
  selectedAccountAddress?: string
}

type MetadataStore = Record<string, LegacyWalletMeta>

function normalizeWallet(wallet: LegacyWalletMeta): WalletMeta {
  const accounts = wallet.accounts ?? wallet.activeAccounts ?? []
  const selectedAccountAddress = accounts.some(
    account => account.address === wallet.selectedAccountAddress,
  )
    ? wallet.selectedAccountAddress
    : accounts[0]?.address

  return {
    id: wallet.id,
    name: wallet.name,
    type: wallet.type,
    accounts,
    selectedAccountAddress,
  }
}

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
  return Object.values(store).map(normalizeWallet)
}

export async function get(walletId: string): Promise<WalletMeta | null> {
  const store = await getStore()
  const wallet = store[walletId]
  if (!wallet) return null
  return normalizeWallet(wallet)
}

export async function save(wallet: WalletMeta): Promise<void> {
  const store = await getStore()
  store[wallet.id] = normalizeWallet(wallet)
  await setStore(store)
}

export async function addAccount(
  walletId: string,
  account: WalletAccount,
): Promise<void> {
  const wallet = await get(walletId)
  if (!wallet) throw new Error(`Wallet ${walletId} not found`)
  if (wallet.accounts.some(a => a.address === account.address)) return
  wallet.accounts.push(account)
  if (!wallet.selectedAccountAddress) {
    wallet.selectedAccountAddress = account.address
  }
  await save(wallet)
}

export async function remove(walletId: string): Promise<void> {
  const store = await getStore()
  delete store[walletId]
  await setStore(store)
}
