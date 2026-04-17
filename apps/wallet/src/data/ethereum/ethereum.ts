import { Buffer } from 'buffer'

import { callAnvilRpc } from '@/lib/anvil-rpc'

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
  // Fetch nonce
  const nonceHex = await getNonceHex(fromAddress, network)
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

  // broadcast
  const txid = await callAnvilRpc<string>('eth_sendRawTransaction', [rawTx])

  return {
    txid,
  }
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
  const nonceHex = await getNonceHex(fromAddress, network)
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

  const txid = await callAnvilRpc<string>('eth_sendRawTransaction', [rawTx])

  return { txid }
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
  // Fetch nonce
  const nonceHex = await getNonceHex(fromAddress, network)
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

  // broadcast
  const txid = await callAnvilRpc<string>('eth_sendRawTransaction', [rawTx])

  return {
    txid,
  }
}

/**
 * UTILS
 */

// Function to pad hex strings to even length
const padHex = (hexStr: string) => {
  hexStr = hexStr.replace(/^0x/, '')
  return hexStr.length % 2 === 1 ? '0' + hexStr : hexStr
}

// Fetch the nonce for the given address and network
const fetchNetworkNonce = async (fromAddress: string): Promise<number> => {
  const hex = await callAnvilRpc<string>('eth_getTransactionCount', [
    fromAddress,
    'pending',
  ])
  return Number(hex)
}

/**
 * Track the nonce for the given address and network locally,
 * this avoids nonce collisions when sending two tx in a very short period of time.
 */
const localNonceTracker = new Map<string, number>()
const getNonceHex = async (
  fromAddress: string,
  network: string,
): Promise<string> => {
  const key = `${fromAddress}:${network}`
  const networkNonce = await fetchNetworkNonce(fromAddress)
  const localNonce = localNonceTracker.get(key) ?? 0
  const nonce = Math.max(networkNonce, localNonce)

  localNonceTracker.set(key, nonce + 1)

  return padHex(nonce.toString(16))
}

// Get the chain ID in hex format
const getChainIdHex = (chainID: string): string => {
  return BigInt(chainID).toString(16).padStart(2, '0')
}
