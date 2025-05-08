// Service/Provider

type UTXO = {
  txid: string
  vout: number
  status: {
    confirmed: boolean
    block_height: number
    block_hash: string
    block_time: number
  }
  value: number
}

export async function getUtxos(address: string): Promise<UTXO[]> {
  const response = await fetch(
    `https://mempool.space/testnet4/api/address/${address}/utxo`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch UTXOs')
  }

  const utxos = await response.json()
  return utxos
}

export async function getFeeRate(): Promise<number> {
  const response = await fetch(
    'https://mempool.space/testnet4/api/v1/fees/recommended',
  )
  if (!response.ok) {
    throw new Error('Failed to fetch fee estimates')
  }
  const {
    // fastestFee,
    halfHourFee,
    //  hourFee
  } = await response.json()
  return halfHourFee // returns sat/vB
}

export function selectUtxos(
  utxos: UTXO[],
  targetAmount: number,
  feeRate: number,
) {
  const selectedUtxos = []
  let totalSelected = 0

  const sortedUtxos = [...utxos].sort((a, b) => b.value - a.value)

  for (const utxo of sortedUtxos) {
    selectedUtxos.push(utxo)
    totalSelected += utxo.value

    const estimatedSize = selectedUtxos.length * 180 // rough estimate
    const estimatedFee = estimatedSize * feeRate

    if (totalSelected >= targetAmount + estimatedFee) {
      return {
        selectedUtxos,
        changeAmount: totalSelected - targetAmount - estimatedFee,
      }
    }
  }

  throw new Error('Insufficient funds')
}

export async function broadcastTransaction(txHex: string): Promise<string> {
  const response = await fetch('https://mempool.space/testnet4/api/tx', {
    method: 'POST',
    // 010000000001019e554db8f57bc421b5cf053521a876a01bb7e68659e2a22d42c20b3ee2a302f30100000000ffffffff02102700000000000016001428fffc09aa76e6d4c5c6e4bede066d70e66cbddfd74b070000000000160014a36e39b47df04a782810f9fbf7220afb83d9b11f02483045022100b9461a523f5b54c6d65bdb9d417fc303ef3e239255992179d3628a47bd5fa620022054dc310317731a93ad73e8e6c5250012a7923ab3a9f8632477b46bd25e424b980121030d2c8855247560b68a15a575559a43a7da2e7348d95249cc538901e94e09ad2d00000000
    body: txHex,
  })

  if (!response.ok) {
    // sendrawtransaction RPC error: {"code":-26,"message":"mandatory-script-verify-flag-failed (Script failed an OP_EQUALVERIFY operation)"}
    throw new Error('Failed to broadcast transaction')
  }

  const txid = await response.text()
  return txid
}
