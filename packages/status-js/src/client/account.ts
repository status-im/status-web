import { getPublicKey, utils } from 'ethereum-cryptography/secp256k1'
import { bytesToHex, hexToBytes } from 'ethereum-cryptography/utils'

import { compressPublicKey } from '../utils/compress-public-key'
import { createUserURLWithPublicKey } from '../utils/create-url'
import { generateUsername } from '../utils/generate-username'
import { signData, verifySignedData } from '../utils/sign-data'

import type { Client } from './client'
import type { Community } from './community/community'

type MembershipStatus = 'none' | 'requested' | 'approved' | 'kicked' // TODO: add 'banned'

export class Account {
  #client: Client

  privateKey: string
  publicKey: string
  chatKey: string
  username: string
  membership: MembershipStatus
  link: URL

  constructor(client: Client, initialAccount?: Account) {
    this.#client = client

    const privateKey = initialAccount
      ? hexToBytes(initialAccount.privateKey)
      : utils.randomPrivateKey()
    const publicKey = getPublicKey(privateKey)

    this.privateKey = bytesToHex(privateKey)
    this.publicKey = bytesToHex(publicKey)
    this.chatKey = '0x' + compressPublicKey(this.publicKey)
    this.username = generateUsername('0x' + this.publicKey)
    this.membership = initialAccount ? initialAccount.membership : 'none'
    this.link = createUserURLWithPublicKey(this.chatKey)
  }

  async sign(payload: Uint8Array | string) {
    return await signData(payload, this.privateKey)
  }

  verify(signature: Uint8Array, payload: Uint8Array | string) {
    return verifySignedData(signature, payload, this.publicKey)
  }

  updateMembership(community: Community): void {
    const isMember = community.isMember('0x' + this.publicKey)

    switch (this.membership) {
      case 'none': {
        community.requestToJoin()
        this.membership = 'requested'
        // fixme: this is a hack to make sure the UI updates when the membership status changes
        this.#client.account = this
        return
      }

      case 'approved': {
        if (isMember === false) {
          this.membership = 'kicked'
          this.#client.account = this // fixme
        }
        return
      }

      case 'requested': {
        if (isMember) {
          this.membership = 'approved'
          this.#client.account = this // fixme
        }
        return
      }
    }
  }
}
