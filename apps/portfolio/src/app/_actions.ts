'use server'

import { getAPIClient } from '../data/api'

import type { NetworkType } from '@status-im/wallet/data'

export type Provider = 'moonpay'

type ApiInput = {
  name: Provider
  address?: string
}

export async function handleCryptoOnRamp(input: ApiInput) {
  const { name, address } = input

  // Redirect to the provider's website
  let redirectUrl = ''

  if (name === 'moonpay') {
    redirectUrl = `https://buy.moonpay.com?apiKey=pk_live_YQC6CQPA5qqDu0unEwHJyAYQyeIqFGR`
  }

  if (!address) {
    throw new Error('Address is required')
  }

  return { url: redirectUrl }
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
    addresses.map(async address => {
      const apiClient = await getAPIClient()

      const result = await apiClient.assets.all({
        address,
        networks,
      })

      return result
    })
  )

  return Object.fromEntries(
    addresses.map((address, index) => [address, results[index]])
  )
}
