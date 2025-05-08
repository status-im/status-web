'use server'

import crypto from 'crypto'
import { match } from 'ts-pattern'

import { serverEnv } from '../config/env.server.mjs'
import { api } from '../data/api'

import type { NetworkType } from '@status-im/wallet/data'

export type Provider = 'mercuryo' | 'ramp' | 'moonpay'

type ApiInput = {
  name: Provider
  asset?: string
  network?: string
  address?: string
}

function getChainIdFromCode(chainCode: string): number | undefined {
  return match(chainCode)
    .with('ETHEREUM', () => 1)
    .with('ARBITRUM', () => 42161)
    .with('OPTIMISM', () => 10)
    .with('BASE', () => 8453)
    .with('POLYGON', () => 137)
    .with('BSC', () => 56)
    .otherwise(() => undefined)
}

function convertIpfsUriToHttp(uri: string): string {
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '')
    return `https://ipfs.io/ipfs/${cid}`
  }
  return uri
}

export async function handleCryptoOnRamp(input: ApiInput) {
  const { name, network, asset, address } = input

  // Redirect to the provider's website
  let redirectUrl = ''

  if (name === 'moonpay') {
    redirectUrl = `https://buy.moonpay.com?apiKey=pk_live_YQC6CQPA5qqDu0unEwHJyAYQyeIqFGR`
  }

  if (name === 'ramp') {
    redirectUrl = `https://app.ramp.network/?hostApiKey=zrtf9u2uqebeyzcs37fu5857tktr3eg9w5tffove&hostAppName=Status&swapAsset=ETH_*,ARBITRUM_*,OPTIMISM_*`
  }

  if (!address) {
    throw new Error('Address is required')
  }

  if (name === 'mercuryo') {
    const baseUrl = `https://exchange.mercuryo.io/?type=buy&network=${network}&currency=${asset}&address=${address}&hide_address=false&fix_address=true&widget_id=6a7eb330-2b09-49b7-8fd3-1c77cfb6cd47`

    const signature = crypto
      .createHmac('sha512', serverEnv.MERCURYO_SECRET_KEY)
      .update(new URL(baseUrl).search)
      .digest('hex')

    redirectUrl = `${baseUrl}&signature=${encodeURIComponent(signature)}`
  }

  return { url: redirectUrl }
}

type Icons = {
  png: string
  relative: { png: string; svg: string }
  svg: string
}

type CryptoCurrency = {
  contract: string
  currency: string
  network: string
  network_label: string
  show_network_icon: boolean
}

type Response = {
  data: {
    config: {
      base: Record<string, string>
      crypto_currencies: CryptoCurrency[]
      default_networks: Record<string, string>
      display_options: Record<
        string,
        { fullname: string; total_digits: number; display_digits: number }
      >
      has_withdrawal_fee: Record<string, boolean>
      icons: Record<string, Icons>
      networks: Record<string, { name: string; icons: Icons }>
    }
    crypto: string[]
    fiat: string[]
  }
  status: number
}

export type Currency = {
  contract_address: string
  code: string
  label: string
  network: string
  imageUrl: string
}

export const getSupportedCurrencies = async (): Promise<Currency[]> => {
  // Fetch the data from Mercuryo and cache it for 24 hours
  const response = await fetch('https://api.mercuryo.io/v1.6/lib/currencies', {
    next: {
      revalidate: 86400, // 24 hours
    },
  })

  const data: Response = await response.json()

  if (data.status !== 200) {
    throw new Error('Failed to fetch data from Mercuryo')
  }

  const supportedCurrencies = data.data.config.crypto_currencies
    .filter(currency => {
      // Get the chain ID from the network (e.g., 'ETHEREUM', 'ARBITRUM')
      const chainId = getChainIdFromCode(currency.network)

      if (currency.currency === 'ETH' && !!chainId) {
        return true
      }

      // Find matching Mercuryo token by contract address and network chain ID.
      return ([] as any).some((uniswapToken: any) => {
        // Check if token is either Ethereum or the contract address matches
        return (
          chainId === uniswapToken.chainId &&
          uniswapToken.address.toLowerCase() === currency.contract.toLowerCase()
        )
      })
    })
    .map(currency => {
      const tokenFromUniswap = ([] as any).find((uniswapToken: any) => {
        return (
          uniswapToken.address.toLowerCase() === currency.contract.toLowerCase()
        )
      })

      // If the currency is ETH, return the Ether object because it's not in the Uniswap tokens list
      if (currency.currency === 'ETH') {
        return {
          contract_address: currency.contract,
          code: currency.currency,
          label: 'Ether',
          network: currency.network,
          imageUrl: '/images/tokens/eth.png',
        }
      }

      return {
        contract_address: tokenFromUniswap?.address || '',
        code: tokenFromUniswap?.symbol || '',
        label: tokenFromUniswap?.name || '',
        network: currency.network || '',
        imageUrl: convertIpfsUriToHttp(tokenFromUniswap?.imageUrl || ''),
      }
    })

  return supportedCurrencies
}

export async function getAccountsData(
  addresses: string[],
  networks: NetworkType[]
) {
  if (!addresses || addresses.length === 0) return {}
  if (!addresses.length) {
    throw new Error('No addresses provided')
  }
  const results = await Promise.all(
    addresses.map(address =>
      api.assets.all({
        address,
        networks,
      })
    )
  )

  return Object.fromEntries(
    addresses.map((address, index) => [address, results[index]])
  )
}
