import { ec } from 'elliptic'
import { PageDirection, utils } from 'js-waku'

import { idToContactCodeTopic } from './contentTopic'
import { ChatIdentity } from './proto/communities/v1/chat_identity'

import type { Waku } from 'js-waku'

const EC = new ec('secp256k1')

// TODO: rename
const hexToBuf = utils.hexToBytes
export { hexToBuf }

// TODO: rename
/**
 * Return hex string with 0x prefix (commonly used for string format of a community id/public key.
 */
export function bufToHex(buf: Uint8Array): string {
  return '0x' + utils.bytesToHex(buf)
}

export function compressPublicKey(key: Uint8Array): string {
  const PubKey = EC.keyFromPublic(key)
  return '0x' + PubKey.getPublic(true, 'hex')
}

export function genPrivateKeyWithEntropy(key: string): Uint8Array {
  const pair = EC.genKeyPair({ entropy: key })
  return hexToBuf('0x' + pair.getPrivate('hex'))
}

export async function getLatestUserNickname(
  key: Uint8Array,
  waku: Waku
): Promise<{ clock: number; nickname: string }> {
  const publicKey = bufToHex(key)
  let nickname = ''
  let clock = 0
  await waku.store.queryHistory([idToContactCodeTopic(publicKey)], {
    callback: msgs =>
      msgs.some(e => {
        try {
          if (e.payload) {
            const chatIdentity = ChatIdentity.decode(e?.payload)
            if (chatIdentity) {
              if (chatIdentity?.displayName) {
                clock = chatIdentity?.clock ?? 0
                nickname = chatIdentity?.displayName
              }
            }
            return true
          }
        } catch {
          return false
        }
      }),
    pageDirection: PageDirection.BACKWARD,
  })
  return { clock, nickname }
}
