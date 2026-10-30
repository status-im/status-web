import {
  type Hex,
  hexToBigInt,
  hexToNumber,
  isAddressEqual,
  parseTransaction,
  recoverTransactionAddress,
  serializeTransaction,
} from 'viem'

import { nonceTracker, RENEWED_HOLD_TTL_MS } from '../../lib/nonce-tracker'
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
  renewsHold?: boolean
}

const PARITY_BY_V: Record<number, 0 | 1> = { 0: 0, 1: 1, 27: 0, 28: 1 }

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
    input.renewsHold ? RENEWED_HOLD_TTL_MS : undefined,
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
  const held = nonceTracker.claimHeld(input.nonceReservationId)
  if (!held) {
    throw new Error('Signing took too long. Sign the transaction again.')
  }
  const unsigned = parseTransaction(input.serializedUnsignedTx)
  let txid: string
  try {
    const sig = input.signature.slice(2)
    if (sig.length !== 130) {
      throw new Error(`Expected 65-byte signature, got ${sig.length / 2} bytes`)
    }
    const r = `0x${sig.slice(0, 64)}` as Hex
    const s = `0x${sig.slice(64, 128)}` as Hex
    const v = hexToNumber(`0x${sig.slice(128, 130)}` as Hex)
    const yParity = PARITY_BY_V[v]
    if (yParity === undefined) {
      throw new Error(`Unexpected signature v value ${v}`)
    }
    const signed = serializeTransaction(unsigned, { r, s, yParity })
    // A device can sign with another key, and the network would still accept it.
    const signer = await recoverTransactionAddress({
      serializedTransaction: signed,
    })
    if (!isAddressEqual(signer, input.fromAddress as Hex)) {
      throw new Error(`Signed by ${signer}, not by ${input.fromAddress}`)
    }
    txid = await broadcast(signed.slice(2), input.network)
  } catch (error) {
    held.release()
    throw error
  }
  await held.commit()
  return { txid }
}

export function renewNonceReservation(nonceReservationId: string): boolean {
  return nonceTracker.renewHeld(nonceReservationId)
}

export function releaseNonceReservation(nonceReservationId: string): void {
  nonceTracker.releaseHeld(nonceReservationId)
}
