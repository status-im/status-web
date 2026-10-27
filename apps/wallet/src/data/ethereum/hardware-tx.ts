import {
  type Hex,
  hexToBigInt,
  hexToNumber,
  parseTransaction,
  serializeTransaction,
} from 'viem'

import { nonceTracker } from '../../lib/nonce-tracker'
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
  nonceReservationId: string
}

export async function buildUnsignedEthTransaction(
  input: BuildInput,
): Promise<UnsignedTransactionResult> {
  const { id, nonce } = await nonceTracker.reserveHeld(
    input.fromAddress,
    input.network,
  )
  try {
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
    return {
      serializedUnsignedTx,
      chainId: input.chainId,
      nonceReservationId: id,
    }
  } catch (error) {
    nonceTracker.releaseHeld(id)
    throw error
  }
}

export async function broadcastSignedEthTransaction(input: {
  serializedUnsignedTx: Hex
  signature: Hex
  network: string
  fromAddress: string
  nonceReservationId: string
}): Promise<{ txid: string }> {
  const unsigned = parseTransaction(input.serializedUnsignedTx)
  let txid: string
  try {
    const sig = input.signature.slice(2)
    if (sig.length !== 130) {
      throw new Error(`Expected 65-byte signature, got ${sig.length / 2} bytes`)
    }
    const r = `0x${sig.slice(0, 64)}` as Hex
    const s = `0x${sig.slice(64, 128)}` as Hex
    const vByte = hexToNumber(`0x${sig.slice(128, 130)}` as Hex)
    const yParity = (vByte === 0 || vByte === 27 ? 0 : 1) as 0 | 1
    const signed = serializeTransaction(unsigned, { r, s, yParity })
    txid = await broadcast(signed.slice(2), input.network)
  } catch (error) {
    nonceTracker.releaseHeld(input.nonceReservationId)
    throw error
  }
  await nonceTracker.commitHeld(
    input.nonceReservationId,
    input.fromAddress,
    input.network,
    unsigned.nonce ?? 0,
  )
  return { txid }
}

export function releaseNonceReservation(nonceReservationId: string): void {
  nonceTracker.releaseHeld(nonceReservationId)
}
