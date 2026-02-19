import type { WalletAccount } from './wallet-metadata'
import type { WalletCore } from '@trustwallet/wallet-core'

function pathIndex(path: string): number {
  const segments = path.split('/')
  const last = segments[segments.length - 1]
  const n = parseInt(last, 10)
  return Number.isNaN(n) ? 0 : n
}

export function deriveNextAccountIndex(
  existingAccounts: WalletAccount[],
  coin: number,
): number {
  const indices = existingAccounts
    .filter(a => a.coin === coin)
    .map(a => pathIndex(a.derivationPath))
  if (indices.length === 0) return 0
  return Math.max(...indices) + 1
}

export function deriveAccount(
  walletCore: WalletCore,
  mnemonic: string,
  coin: InstanceType<WalletCore['CoinType']>,
  derivation: InstanceType<WalletCore['Derivation']>,
  index: number = 0,
): WalletAccount {
  const hd = walletCore.HDWallet.createWithMnemonic(mnemonic, '')
  try {
    const basePath = walletCore.CoinTypeExt.derivationPathWithDerivation(
      coin,
      derivation,
    )
    const path =
      index === 0 ? basePath : basePath.replace(/\/[^/]+$/, `/${index}`)
    const privateKey = hd.getKey(coin, path)
    try {
      const address = walletCore.CoinTypeExt.deriveAddress(coin, privateKey)
      return {
        address,
        coin: coin.value,
        derivationPath: path,
        derivation: derivation.value,
      }
    } finally {
      privateKey.delete()
    }
  } finally {
    hd.delete()
  }
}

export function derivePrivateKey(
  walletCore: WalletCore,
  mnemonic: string,
  coin: InstanceType<WalletCore['CoinType']>,
  derivationPath: string,
): InstanceType<WalletCore['PrivateKey']> {
  const hd = walletCore.HDWallet.createWithMnemonic(mnemonic, '')
  try {
    return hd.getKey(coin, derivationPath)
  } finally {
    hd.delete()
  }
}

export function privateKeyFromData(
  walletCore: WalletCore,
  data: Uint8Array,
): InstanceType<WalletCore['PrivateKey']> {
  return walletCore.PrivateKey.createWithData(data)
}
