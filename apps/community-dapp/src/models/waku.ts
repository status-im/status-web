import { BigNumber } from 'ethers'

export type WakuVoteData = {
  sntAmount: BigNumber
  address: string
  vote: string
  sign: string
  timestamp: number
  roomID: number
}

export type WakuFeatureData = {
  timestamp: number
  sntAmount: BigNumber
  voter: string
  community: string
  sign: string
}
