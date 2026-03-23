import { TypedMessage } from 'eth-sig-util'

type VoteType = {
  EIP712Domain: { name: string; type: string }[]
  Vote: { name: string; type: string }[]
}

export interface TypedVote extends TypedMessage<VoteType> {
  message: {
    roomIdAndType: string
    sntAmount: string
    voter: string
  }
}

type FeatureType = {
  EIP712Domain: { name: string; type: string }[]
  Vote: { name: string; type: string }[]
}

export interface TypedFeature extends TypedMessage<FeatureType> {
  message: {
    voter: string
    sntAmount: string
    community: string
  }
}
