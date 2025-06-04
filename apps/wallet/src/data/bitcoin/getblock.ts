// Service/Provider

export async function getUtxos(fromAccount: string) {
  const getBlockUrl = `https://go.getblock.io/${import.meta.env.WXT_GETBLOCK_API_KEY}`
  const response = await fetch(getBlockUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'listunspent',
      params: [1, 9999999, [fromAccount]],
      id: 'getblock.io',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch UTXOs')
  }

  const utxos = await response.json()
  return utxos
}

export async function broadcastTransaction(
  signedTxHex: string,
): Promise<string> {
  const getBlockUrl = `https://go.getblock.io/${import.meta.env.WXT_GETBLOCK_API_KEY}`

  const response = await fetch(getBlockUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'sendrawtransaction',
      params: [signedTxHex],
      id: 'getblock.io',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to broadcast transaction')
  }

  return await response.json()
}
