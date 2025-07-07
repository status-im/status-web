import { Buffer } from 'buffer'

import { encoder } from '../encoder'

import type { WalletCore } from '@trustwallet/wallet-core'

export async function send({
  walletCore,
  walletPrivateKey,
  chainID,
  toAddress,
  amount,
  fromAddress,
  network = 'ethereum',
  gasLimit,
  maxFeePerGas,
  maxInclusionFeePerGas,
}: {
  walletCore: WalletCore
  walletPrivateKey: InstanceType<WalletCore['PrivateKey']>
  chainID: string
  toAddress: string
  amount: string
  fromAddress: string
  network?: string
  gasLimit: string
  maxFeePerGas: string
  maxInclusionFeePerGas: string
}) {
  const nonceUrl = new URL(
    `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/nodes.getNonce`,
  )
  nonceUrl.searchParams.set(
    'input',
    JSON.stringify({ json: { address: fromAddress, network } }),
  )
  const nonceResponse = await fetch(nonceUrl.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })

  if (!nonceResponse.ok) {
    throw new Error('Failed to fetch nonce')
  }

  const nonceBody = await nonceResponse.json()

  const nonce = nonceBody.result.data.json

  // const feeRate = nodes.getFeeRate

  // fixme: calc nonce and fees
  const txInput = encoder.Ethereum.Proto.SigningInput.create({
    chainId: Uint8Array.from(Buffer.from(chainID, 'hex')),
    // chainId: Buffer.from('01', 'hex'),
    // gasPrice: Buffer.from(feeRate.replace('0x', ''), 'hex'),
    // nonce: Buffer.from('09', 'hex'),
    // nonce: Buffer.from('00', 'hex'),
    nonce: Buffer.from(nonce.replace(/^0x/, '0'), 'hex'),
    // maxFeePerGas: Buffer.from(feeRate, 'hex'),
    // // maxInclusionFeePerGas: Buffer.from('3b9aca00', 'hex'),
    // maxInclusionFeePerGas: Buffer.from('01', 'hex'),
    // gasLimit: Buffer.from('5208', 'hex'),
    // gasPrice: Buffer.from('04a817c800', 'hex'),
    // gasLimit: Buffer.from('5208', 'hex'),
    gasLimit: Uint8Array.from(Buffer.from(gasLimit, 'hex')),
    maxFeePerGas: Uint8Array.from(Buffer.from(maxFeePerGas, 'hex')),
    maxInclusionFeePerGas: Uint8Array.from(
      Buffer.from(maxInclusionFeePerGas, 'hex'),
    ),
    toAddress: toAddress,
    transaction: {
      transfer: {
        amount: Uint8Array.from(Buffer.from(amount, 'hex')),
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
  const url = new URL(
    `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/nodes.broadcastTransaction`,
  )

  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      json: {
        txHex: rawTx,
        network: 'ethereum',
      },
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to broadcast transaction')
  }

  const body = await response.json()
  const txid = body.result.data.json

  return {
    txid,
  }
}
