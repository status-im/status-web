import { Buffer } from 'buffer'

import { encoder } from '../encoder'
import {
  broadcastTransaction,
  // getFeeRate
} from './etherscan'

import type { WalletCore } from '@trustwallet/wallet-core'

export async function send({
  walletCore,
  walletPrivateKey,
  chainID,
  toAddress,
  amount,
}: {
  walletCore: WalletCore
  walletPrivateKey: InstanceType<WalletCore['PrivateKey']>
  chainID: string
  toAddress: string
  amount: string
}) {
  // const feeRate = await getFeeRate()

  // fixme: calc nonce and fees
  const txInput = encoder.Ethereum.Proto.SigningInput.create({
    chainId: Buffer.from(chainID, 'hex'),
    // chainId: Buffer.from('01', 'hex'),
    // gasPrice: Buffer.from(feeRate.replace('0x', ''), 'hex'),
    // nonce: Buffer.from('09', 'hex'),
    // nonce: Buffer.from('00', 'hex'),
    nonce: Buffer.from('02', 'hex'),
    // maxFeePerGas: Buffer.from(feeRate, 'hex'),
    // // maxInclusionFeePerGas: Buffer.from('3b9aca00', 'hex'),
    // maxInclusionFeePerGas: Buffer.from('01', 'hex'),
    // gasLimit: Buffer.from('5208', 'hex'),
    // gasPrice: Buffer.from('04a817c800', 'hex'),
    // gasLimit: Buffer.from('5208', 'hex'),
    maxInclusionFeePerGas: Buffer.from('0077359400', 'hex'),
    maxFeePerGas: Buffer.from('00b2d05e00', 'hex'),
    gasLimit: Buffer.from('0130B9', 'hex'),
    toAddress: toAddress,
    transaction: {
      transfer: {
        amount: Buffer.from(amount, 'hex'),
      },
    },
    privateKey: walletPrivateKey.data(),
    txMode: encoder.Ethereum.Proto.TransactionMode.Enveloped,
  })

  const inputEncoded =
    encoder.Ethereum.Proto.SigningInput.encode(txInput).finish()

  // sign
  const outputData = walletCore.AnySigner.sign(
    inputEncoded,
    walletCore.CoinType.ethereum,
  )
  const output = encoder.Ethereum.Proto.SigningOutput.decode(outputData)
  const rawTx = walletCore.HexCoding.encode(output.encoded)

  // broadcast
  const txid = await broadcastTransaction(rawTx)

  return {
    txid,
  }
}
