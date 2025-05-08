import { encoder } from '../encoder'

import type { WalletCore } from '@trustwallet/wallet-core'

export async function send({
  walletCore,
  walletPrivateKey, // Trust Wallet private key
  fromAddress,
  toAddress,
  amount,
}: {
  walletCore: WalletCore
  walletPrivateKey: InstanceType<WalletCore['PrivateKey']>
  fromAddress: string
  toAddress: string
  amount: number
  // amount: string
}) {
  const recentBlockhash = await getRecentBlockhash()

  // todo: calc fee https://github.com/trustwallet/wallet-core/issues/4234#issuecomment-2625361506
  const txInput = encoder.Solana.Proto.SigningInput.create({
    recentBlockhash,
    privateKey: walletPrivateKey.data(),
    sender: fromAddress,
    // feePayer: fromAddress,
    // feePayerPrivateKey: walletPrivateKey.data(),
    transferTransaction: encoder.Solana.Proto.Transfer.create({
      recipient: toAddress,
      value: amount,

      // sender: fromAddress,
    }),
    // txEncoding: encoder.Solana.Proto.Encoding.Base58,
  })

  const inputEncoded =
    encoder.Solana.Proto.SigningInput.encode(txInput).finish()

  // sign
  const outputData = walletCore.AnySigner.sign(
    inputEncoded,
    walletCore.CoinType.solana,
  )
  const output = encoder.Solana.Proto.SigningOutput.decode(outputData)
  // const rawTx = walletCore.HexCoding.encode(output.encoded)
  const rawTx = output.encoded

  const txid = await broadcastTransaction(rawTx)

  return {
    txid,
  }
}

async function getRecentBlockhash() {
  const response = await fetch('https://api.devnet.solana.com', {
    method: 'POST',
    headers: {
      // note: 415 status code without it
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'getLatestBlockhash',
      // params: [
      //   {
      //     commitment: 'processed',
      //   },
      // ],
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to get recent blockhash')
  }

  const data = await response.json()

  return data.result.value.blockhash
}

async function broadcastTransaction(rawTx: string) {
  const response = await fetch('https://api.devnet.solana.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'sendTransaction',
      params: [rawTx],
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to broadcast transaction')
  }

  const data = await response.json()

  return data.result
}
