// Transaction

// fixme: add Buffer (polyfill?) or rebuild for browser
// import * as bitcoin from 'bitcoinjs-lib'
// todo: replace buffer and long
import { Buffer } from 'buffer'
import Long from 'long'

import { encoder } from '../encoder'
import {
  broadcastTransaction,
  getFeeRate,
  getUtxos,
  selectUtxos,
} from './mempool'

import type { WalletCore } from '@trustwallet/wallet-core'

// export async function send({
//   privateKey,
//   fromAddress,
//   toAddress,
//   amount, // in satoshis
// }: {
//   privateKey: string
//   fromAddress: string
//   toAddress: string
//   amount: number
// }) {
//   const feeRate = await getFeeRate()
//   const utxos = await getUtxos(fromAddress)
//   const confirmedUtxos = utxos.filter(utxo => utxo.status.confirmed)

//   const { selectedUtxos, changeAmount } = selectUtxos(
//     confirmedUtxos,
//     amount,
//     feeRate,
//   )

//   const psbt = new bitcoin.Psbt() // create, update, sign, combine, finalize, extract

//   selectedUtxos.forEach(utxo => {
//     psbt.addInput({
//       hash: utxo.txid,
//       index: utxo.vout,
//       witnessUtxo: {
//         script: bitcoin.address.toOutputScript(fromAddress),
//         value: utxo.value,
//       },
//     })
//   })

//   psbt.addOutput({
//     address: toAddress,
//     value: amount,
//   })

//   if (
//     changeAmount > 546 // dust limit
//   ) {
//     psbt.addOutput({
//       address: fromAddress,
//       value: changeAmount,
//     })
//   }

//   // fixme: use private key from Trust Wallet's core
//   psbt.signAllInputs(privateKey)
//   psbt.finalizeAllInputs()

//   const txHex = psbt.extractTransaction().toHex()

//   // broadcast
//   // const txid = await broadcastTransaction(txHex)

//   // return {
//   //   txid,
//   //   fee:
//   //     selectedUtxos.reduce((sum, utxo) => sum + utxo.value, 0) -
//   //     amount -
//   //     changeAmount,
//   // }
// }

// todo?: sign each utxo
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
}) {
  const feeRate = await getFeeRate()
  const utxos = await getUtxos(fromAddress)
  const confirmedUtxos = utxos.filter(utxo => utxo.status.confirmed)
  // fixme?: select smallest utxos
  const { selectedUtxos } = selectUtxos(confirmedUtxos, amount, feeRate)

  const utxo = selectedUtxos.map(utxo => {
    return encoder.Bitcoin.Proto.UnspentTransaction.create({
      outPoint: {
        hash: new Uint8Array(Buffer.from(utxo.txid, 'hex').reverse()),
        index: utxo.vout,
        sequence: 4294967295, // default sequence
        // sequence: UINT32_MAX,
      },
      amount: new Long(utxo.value),
      script: walletCore.BitcoinScript.lockScriptForAddress(
        fromAddress,
        walletCore.CoinType.bitcoin,
      ).data(),
    })
  })

  const txInput = encoder.Bitcoin.Proto.SigningInput.create({
    hashType: walletCore.BitcoinSigHashType.all.value,
    coinType: walletCore.CoinType.bitcoin.value,
    amount: new Long(amount),
    toAddress: toAddress,
    // lockTime: 0,
    changeAddress: fromAddress,
    utxo: utxo,
    // byteFee: new Long(9),
    byteFee: new Long(feeRate),
    privateKey: [walletPrivateKey.data()],
  })

  // input
  const inputEncoded =
    encoder.Bitcoin.Proto.SigningInput.encode(txInput).finish()

  // sign
  const outputData = walletCore.AnySigner.sign(
    inputEncoded,
    walletCore.CoinType.bitcoin,
  )
  const output = encoder.Bitcoin.Proto.SigningOutput.decode(outputData)
  const rawTx = walletCore.HexCoding.encode(output.encoded)

  // broadcast
  const txid = await broadcastTransaction(rawTx.replace(/^0x/, ''))

  return {
    txid,
    // fee: output.fee,
  }
}
