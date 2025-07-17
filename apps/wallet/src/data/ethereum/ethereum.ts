import { Buffer } from 'buffer'

import { encoder } from '../encoder'

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
  toAddress,
  amount,
  fromAddress,
  network = 'ethereum',
  gasLimit,
  maxFeePerGas,
  maxInclusionFeePerGas,
  data,
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
  data?: string
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

  // const chainIdDecimal = parseInt(chainID, 16).toString()
  // const currentNonce = await getNonce(fromAddress, chainIdDecimal)
  // // todo?: retrieve balance from internal wallet instead of etherscan
  // const balance = await getAccountBalance(fromAddress, chainIdDecimal)
  // const { priorityFeeWei, finalMaxFeePerGas } = await getFeeRate(chainIdDecimal)

  // if (priorityFeeWei >= finalMaxFeePerGas) {
  //   throw new Error('priority fee >= max fee')
  // }

  // const gasLimitWithCushionHex = await estimateGasRPC({
  //   from: fromAddress,
  //   to: toAddress,
  //   value: amount !== '0' ? `0x${BigInt(amount).toString(16)}` : undefined,
  //   data: data && data !== '0x' ? data : undefined,
  //   chainId: chainIdDecimal,
  // })
  // const gasLimitWithCushion = parseInt(gasLimitWithCushionHex, 16)

  // const totalCost =
  //   BigInt(amount) + finalMaxFeePerGas * BigInt(gasLimitWithCushion)
  // const balanceBigInt = BigInt(balance)
  // if (balanceBigInt < totalCost) throw new Error(`Insufficient funds`)

  const txInput = encoder.Ethereum.Proto.SigningInput.create({
    chainId: Uint8Array.from(Buffer.from(chainID, 'hex')),
    // chainId: Buffer.from('01', 'hex'),
    // gasPrice: Buffer.from(feeRate.replace('0x', ''), 'hex'),
    // nonce: Buffer.from('09', 'hex'),
    // nonce: Buffer.from('00', 'hex'),
    nonce: Uint8Array.from(Buffer.from(nonce.replace(/^0x/, '0'), 'hex')),
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
