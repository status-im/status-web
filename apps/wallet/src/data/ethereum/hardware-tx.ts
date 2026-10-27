import {
  type Hex,
  hexToBigInt,
  hexToNumber,
  parseTransaction,
  serializeTransaction,
} from 'viem'

import { fetchPendingNonce } from '../../lib/nonce-tracker'
import { broadcast } from './ethereum'

type BuildInput = {
  fromAddress: Hex
  toAddress: Hex
  value: Hex
  data?: Hex
  gasLimit: Hex
  maxFeePerGas: Hex
  maxInclusionFeePerGas: Hex
  network: string
  chainId: number
}

export type UnsignedTransactionResult = {
  serializedUnsignedTx: Hex
  chainId: number
}

export async function buildUnsignedEthTransaction(
  input: BuildInput,
): Promise<UnsignedTransactionResult> {
  const nonce = await fetchPendingNonce(input.fromAddress, input.network)
  const serializedUnsignedTx = serializeTransaction({
    chainId: input.chainId,
    nonce,
    maxFeePerGas: hexToBigInt(input.maxFeePerGas),
    maxPriorityFeePerGas: hexToBigInt(input.maxInclusionFeePerGas),
    gas: hexToBigInt(input.gasLimit),
    to: input.toAddress,
    value: hexToBigInt(input.value),
    data: input.data,
    type: 'eip1559',
  })
  return { serializedUnsignedTx, chainId: input.chainId }
}

export async function broadcastSignedEthTransaction(input: {
  serializedUnsignedTx: Hex
  signature: Hex
  network: string
}): Promise<{ txid: string }> {
  const unsigned = parseTransaction(input.serializedUnsignedTx)
  const sig = input.signature.slice(2)
  if (sig.length !== 130) {
    throw new Error(`Expected 65-byte signature, got ${sig.length / 2} bytes`)
  }
  const r = `0x${sig.slice(0, 64)}` as Hex
  const s = `0x${sig.slice(64, 128)}` as Hex
  const vByte = hexToNumber(`0x${sig.slice(128, 130)}` as Hex)
  const yParity = (vByte === 0 || vByte === 27 ? 0 : 1) as 0 | 1
  const signed = serializeTransaction(unsigned, { r, s, yParity })

  const txid = await broadcast(signed.slice(2), input.network)
  return { txid }
}
