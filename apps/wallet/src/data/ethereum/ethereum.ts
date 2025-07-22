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
  const nonceHex = nonceBody.result.data.json
    .replace(/^0x/, '')
    .padStart(2, '0')

  const chainIdHex = BigInt(chainID).toString(16).padStart(2, '0')

  const cleanAmount = amount.replace(/^0x/, '').padStart(16, '0')

  const txInput = encoder.Ethereum.Proto.SigningInput.create({
    chainId: Uint8Array.from(Buffer.from(chainIdHex, 'hex')),
    nonce: Uint8Array.from(Buffer.from(nonceHex, 'hex')),
    gasLimit: Uint8Array.from(Buffer.from(gasLimit.replace(/^0x/, ''), 'hex')),
    maxFeePerGas: Uint8Array.from(Buffer.from(padHex(maxFeePerGas), 'hex')),
    maxInclusionFeePerGas: Uint8Array.from(
      Buffer.from(padHex(maxInclusionFeePerGas), 'hex'),
    ),
    toAddress,
    transaction: {
      transfer: {
        amount: Uint8Array.from(Buffer.from(cleanAmount, 'hex')),
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
        network,
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

// Utility function to pad hex strings to even length
const padHex = (hexStr: string) => {
  hexStr = hexStr.replace(/^0x/, '')
  return hexStr.length % 2 === 1 ? '0' + hexStr : hexStr
}
