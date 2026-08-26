import { isEthereumTransactionHash, padHex } from '@status-im/wallet/utils'
import { Buffer } from 'buffer'

import { nonceTracker } from '../../lib/nonce-tracker'
import { encoder } from '../encoder'

import type { WalletCore } from '@trustwallet/wallet-core'

const BROADCAST_TRANSACTION_URL = new URL(
  `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/nodes.broadcastTransaction`,
)

/**
 * The upstream reason, not the status code: `parseInsufficientFundsError` reads
 * the node's `insufficient funds for gas * price + value` back out of it.
 */
async function readBroadcastError(response: Response): Promise<string> {
  try {
    const body = await response.json()
    const message = body?.error?.json?.message ?? body?.error?.message
    if (typeof message === 'string' && message) {
      return message
    }
  } catch {
    // Not a tRPC error envelope; the generic message is all there is.
  }
  return 'Failed to broadcast transaction'
}

/**
 * `withNonce` commits on resolve, so returning anything but a real hash burns
 * the nonce on a transaction that does not exist and gaps every later one.
 */
async function broadcast(rawTx: string, network: string): Promise<string> {
  const response = await fetch(BROADCAST_TRANSACTION_URL.toString(), {
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
    throw new Error(await readBroadcastError(response))
  }

  const body = await response.json()
  const txid: unknown = body?.result?.data?.json
  if (typeof txid !== 'string' || !isEthereumTransactionHash(txid)) {
    throw new Error('Broadcast returned no transaction hash')
  }

  return txid
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
  return nonceTracker.withNonce(fromAddress, network, async nonceHex => {
    const chainIdHex = getChainIdHex(chainID)

    const cleanAmount = padHex(amount)

    const txInput = encoder.Ethereum.Proto.SigningInput.create({
      chainId: Uint8Array.from(Buffer.from(chainIdHex, 'hex')),
      nonce: Uint8Array.from(Buffer.from(nonceHex, 'hex')),
      gasLimit: Uint8Array.from(Buffer.from(padHex(gasLimit), 'hex')),
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

    const txid = await broadcast(rawTx, network)

    return { txid }
  })
}

export async function sendContractCall({
  walletCore,
  walletPrivateKey,
  chainID,
  toAddress,
  fromAddress,
  network = 'ethereum',
  gasLimit,
  maxFeePerGas,
  maxInclusionFeePerGas,
  data,
  value = '0',
}: {
  walletCore: WalletCore
  walletPrivateKey: InstanceType<WalletCore['PrivateKey']>
  chainID: string
  toAddress: string
  fromAddress: string
  network?: string
  gasLimit: string
  maxFeePerGas: string
  maxInclusionFeePerGas: string
  data: string
  value?: string
}) {
  return nonceTracker.withNonce(fromAddress, network, async nonceHex => {
    const chainIdHex = getChainIdHex(chainID)
    const cleanData = data.replace(/^0x/, '')
    const cleanValue = padHex(value)

    const txInput = encoder.Ethereum.Proto.SigningInput.create({
      chainId: Uint8Array.from(Buffer.from(chainIdHex, 'hex')),
      nonce: Uint8Array.from(Buffer.from(nonceHex, 'hex')),
      gasLimit: Uint8Array.from(Buffer.from(padHex(gasLimit), 'hex')),
      maxFeePerGas: Uint8Array.from(Buffer.from(padHex(maxFeePerGas), 'hex')),
      maxInclusionFeePerGas: Uint8Array.from(
        Buffer.from(padHex(maxInclusionFeePerGas), 'hex'),
      ),
      toAddress,
      transaction: {
        contractGeneric: {
          amount: Uint8Array.from(Buffer.from(cleanValue, 'hex')),
          data: Uint8Array.from(Buffer.from(cleanData, 'hex')),
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

    const txid = await broadcast(rawTx, network)

    return { txid }
  })
}

export async function sendErc20({
  walletCore,
  walletPrivateKey,
  chainID,
  toAddress,
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
  fromAddress: string
  network?: string
  gasLimit: string
  maxFeePerGas: string
  maxInclusionFeePerGas: string
  data: string
}) {
  return nonceTracker.withNonce(fromAddress, network, async nonceHex => {
    const chainIdHex = getChainIdHex(chainID)
    // For erc20Transfer, we need to extract the recipient address and amount from the data field
    // data contains function signature (4 bytes) + to address (32 bytes) + amount (32 bytes)
    const cleanData = data.replace(/^0x/, '')
    // Extract recipientAddress from cleanData (bytes 4-36, but only last 20 bytes are used)
    const recipientAddress = '0x' + cleanData.slice(32, 72)
    //Extract amount (bytes 72-104) which is 32 bytes
    const tokenAmount = cleanData.slice(72, 136)

    const txInput = encoder.Ethereum.Proto.SigningInput.create({
      chainId: Uint8Array.from(Buffer.from(chainIdHex, 'hex')),
      nonce: Uint8Array.from(Buffer.from(nonceHex, 'hex')),
      gasLimit: Uint8Array.from(Buffer.from(padHex(gasLimit), 'hex')),
      maxFeePerGas: Uint8Array.from(Buffer.from(padHex(maxFeePerGas), 'hex')),
      maxInclusionFeePerGas: Uint8Array.from(
        Buffer.from(padHex(maxInclusionFeePerGas), 'hex'),
      ),
      toAddress,
      transaction: {
        erc20Transfer: {
          to: recipientAddress,
          amount: Uint8Array.from(Buffer.from(tokenAmount, 'hex')),
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

    const txid = await broadcast(rawTx, network)

    return { txid }
  })
}

const getChainIdHex = (chainID: string): string => {
  return BigInt(chainID).toString(16).padStart(2, '0')
}
