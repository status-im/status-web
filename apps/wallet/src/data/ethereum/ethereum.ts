import { Buffer } from 'buffer'

import { encoder } from '../encoder'
import {
  broadcastTransaction,
  estimateGasRPC,
  getAccountBalance,
  getFeeRate,
  getNonce,
} from './etherscan'

import type { WalletCore } from '@trustwallet/wallet-core'

const hexToUint8Array = (hex: string): Uint8Array => {
  const cleaned = hex.replace(/^0x/, '')
  // Ensure even length by padding with 0 if necessary
  const padded = cleaned.length % 2 === 0 ? cleaned : '0' + cleaned
  return new Uint8Array(Buffer.from(padded, 'hex'))
}

export async function send({
  walletCore,
  walletPrivateKey,
  chainID,
  fromAddress,
  toAddress,
  amount,
  data,
}: {
  walletCore: WalletCore
  walletPrivateKey: InstanceType<WalletCore['PrivateKey']>
  chainID: string
  fromAddress: string
  toAddress: string
  amount: string
  data?: string
}) {
  const chainIdDecimal = parseInt(chainID, 16).toString()
  const currentNonce = await getNonce(fromAddress, chainIdDecimal)
  // todo?: retrieve balance from internal wallet instead of etherscan
  const balance = await getAccountBalance(fromAddress, chainIdDecimal)
  const { priorityFeeWei, finalMaxFeePerGas } = await getFeeRate(chainIdDecimal)

  if (priorityFeeWei >= finalMaxFeePerGas) {
    throw new Error('priority fee >= max fee')
  }

  const gasLimitWithCushionHex = await estimateGasRPC({
    from: fromAddress,
    to: toAddress,
    value: amount !== '0' ? `0x${BigInt(amount).toString(16)}` : undefined,
    data: data && data !== '0x' ? data : undefined,
    chainId: chainIdDecimal,
  })
  const gasLimitWithCushion = parseInt(gasLimitWithCushionHex, 16)

  const totalCost =
    BigInt(amount) + finalMaxFeePerGas * BigInt(gasLimitWithCushion)
  const balanceBigInt = BigInt(balance)
  if (balanceBigInt < totalCost) throw new Error(`Insufficient funds`)

  const txInput = encoder.Ethereum.Proto.SigningInput.create({
    chainId: hexToUint8Array(chainID.replace('0x', '')),
    nonce: hexToUint8Array(currentNonce),
    maxFeePerGas: hexToUint8Array(finalMaxFeePerGas.toString(16)),
    maxInclusionFeePerGas: hexToUint8Array(priorityFeeWei.toString(16)),
    gasLimit: hexToUint8Array(gasLimitWithCushion.toString(16)),
    toAddress: toAddress,
    transaction:
      data && data !== '0x'
        ? {
            contractGeneric: {
              amount: hexToUint8Array(BigInt(amount).toString(16)),
              data: hexToUint8Array(data),
            },
          }
        : {
            transfer: {
              amount: hexToUint8Array(BigInt(amount).toString(16)),
            },
          },
    privateKey: walletPrivateKey.data(),
    txMode: encoder.Ethereum.Proto.TransactionMode.Enveloped,
  })

  const inputEncoded =
    encoder.Ethereum.Proto.SigningInput.encode(txInput).finish()
  const outputData = walletCore.AnySigner.sign(
    inputEncoded,
    walletCore.CoinType.ethereum,
  )
  const output = encoder.Ethereum.Proto.SigningOutput.decode(outputData)
  const rawTx = walletCore.HexCoding.encode(output.encoded)
  const txid = await broadcastTransaction(rawTx, chainIdDecimal)

  return {
    txid,
  }
}
