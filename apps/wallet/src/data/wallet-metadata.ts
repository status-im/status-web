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

// TODO: remove LegacyWalletMeta once no user has legacy wallets; use WalletMeta directly in MetadataStore
type LegacyWalletMeta = {
  id: string
  name: string
  type: 'mnemonic' | 'privateKey'
  activeAccounts?: WalletAccount[]
  accounts?: WalletAccount[]
  selectedAccountAddress?: string
}

type MetadataStore = Record<string, LegacyWalletMeta>

// TODO: remove LEGACY_WALLET_NAME, WALLET_NAME_REGEX, and renameLegacyWallets once no user has legacy wallets
const LEGACY_WALLET_NAME = 'Account 1'
// Matches "Wallet 1", "Wallet 42", etc. & captures the trailing integer
const WALLET_NAME_REGEX = /^Wallet (\d+)$/

// TODO: remove isNormalized and normalizeWallet once no user has legacy wallets
function isNormalized(wallet: LegacyWalletMeta): wallet is WalletMeta {
  return wallet.accounts !== undefined && wallet.activeAccounts === undefined
}

function normalizeWallet(wallet: LegacyWalletMeta): WalletMeta {
  if (isNormalized(wallet)) return wallet

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

function renameLegacyWallets(wallets: WalletMeta[]): WalletMeta[] {
  const legacyCount = wallets.filter(w => w.name === LEGACY_WALLET_NAME).length
  if (legacyCount === 0) return wallets

  // Collect integers already used by "Wallet N" names to avoid collisions
  const takenNumbers = new Set<number>()
  for (const w of wallets) {
    const match = WALLET_NAME_REGEX.exec(w.name)
    if (match) takenNumbers.add(Number(match[1]))
  }

  // Pre-compute exactly as many free integers as there are legacy wallets
  const available: number[] = []
  for (let n = 1; available.length < legacyCount; n++) {
    if (!takenNumbers.has(n)) available.push(n)
  }

  // Assign each legacy wallet the next free "Wallet N" name in order
  let idx = 0
  return wallets.map(w => {
    if (w.name !== LEGACY_WALLET_NAME) return w
    return { ...w, name: `Wallet ${available[idx++]}` }
  })
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
  const wallets = Object.values(store).map(normalizeWallet)
  const renamed = renameLegacyWallets(wallets)

  // Persist renames so legacy names are updated once and not re-computed every read
  if (renamed !== wallets) {
    const updated: MetadataStore = {}
    for (const w of renamed) updated[w.id] = w
    await setStore(updated)
  }

  return renamed
}

export async function get(walletId: string): Promise<WalletMeta | null> {
  const all = await getAll()
  return all.find(w => w.id === walletId) ?? null
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
