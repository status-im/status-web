// todo?: rename to provider

export async function getFeeRate() {
  const response = await fetch(
    `https://api-holesky.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=${import.meta.env.WXT_ETHERSCAN_API_KEY}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch fee estimates')
  }
  const { result } = await response.json()
  return result // returns hex
}

export async function broadcastTransaction(txHex: string) {
  // fixme?: "typed transaction too short"
  // const response = await fetch(
  //   `https://api-holesky.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&apikey=${import.meta.env.WXT_ETHERSCAN_API_KEY}`,
  //   {
  //     method: 'POST',
  //     body: txHex,
  //   },
  // )

  const response = await fetch(
    `https://api-holesky.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=${txHex}&apikey=${import.meta.env.WXT_ETHERSCAN_API_KEY}`,
  )

  if (!response.ok) {
    throw new Error('Failed to broadcast transaction')
  }

  const { result } = await response.json()
  return result
}
