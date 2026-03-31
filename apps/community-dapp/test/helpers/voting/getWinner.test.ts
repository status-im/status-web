import { expect } from 'chai'
import { CurrentVoting } from '../../../src/models/community'
import { BigNumber } from 'ethers'
import voting from '../../../src/helpers/voting'

describe('voting', () => {
  describe('getWinner', () => {
    it('for', () => {
      const vote: CurrentVoting = {
        timeLeft: -10,
        timeLeftVerification: -10,
        type: 'Add',
        voteFor: BigNumber.from(1000),
        voteAgainst: BigNumber.from(100),
        votingEndAt: 10000,
        verificationEndAt: 10000,
      }
      expect(voting.getWinner(vote)).to.eq(2)
    })
    it('against', () => {
      const vote: CurrentVoting = {
        timeLeft: -10,
        timeLeftVerification: -10,
        type: 'Add',
        voteFor: BigNumber.from(100),
        voteAgainst: BigNumber.from(1000),
        votingEndAt: 10000,
        verificationEndAt: 10000,
      }
      expect(voting.getWinner(vote)).to.eq(1)
    })
    it('not finished', () => {
      const vote: CurrentVoting = {
        timeLeft: 10,
        timeLeftVerification: -10,
        type: 'Add',
        voteFor: BigNumber.from(100),
        voteAgainst: BigNumber.from(1000),
        votingEndAt: 10000,
        verificationEndAt: 10000,
      }
      expect(voting.getWinner(vote)).to.eq(undefined)
    })
    it('draw - against win', () => {
      const vote: CurrentVoting = {
        timeLeft: -10,
        timeLeftVerification: -10,
        type: 'Add',
        voteFor: BigNumber.from(100),
        voteAgainst: BigNumber.from(100),
        votingEndAt: 10000,
        verificationEndAt: 10000,
      }
      expect(voting.getWinner(vote)).to.eq(1)
    })
  })
})
