import type { WalletMeta } from '../data/wallet-metadata'

/** Mnemonic wallets, and hardware wallets imported with their extended key, can add accounts. */
export function canDeriveAccounts(wallet: WalletMeta): boolean {
  return (
    wallet.type === 'mnemonic' ||
    (wallet.type === 'hardware-qr' && Boolean(wallet.hardware?.xpub))
  )
}
