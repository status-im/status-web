import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  getBranchSyncLinks,
  getBranchSyncDecision,
  type BranchComparisonStatus,
} from '../promotion'

const decide = (status: BranchComparisonStatus, aheadBy = 1) =>
  getBranchSyncDecision({
    aheadBy,
    productionBranch: 'master',
    productionSha: 'master-sha',
    stagingBranch: 'develop',
    stagingSha: 'develop-sha',
    status,
  })

describe('getBranchSyncDecision', () => {
  it('allows fast-forward when staging is ahead of production', () => {
    const decision = decide('ahead', 3)

    assert.equal(decision.kind, 'fast-forward')
    assert.equal(decision.sha, 'develop-sha')
  })

  it('treats identical branch tips as already synced', () => {
    const decision = decide('identical', 0)

    assert.equal(decision.kind, 'already-synced')
    assert.equal(decision.sha, 'master-sha')
  })

  it('rejects diverged branches instead of forcing production', () => {
    const decision = decide('diverged', 2)

    assert.equal(decision.kind, 'blocked')
    assert.match(decision.reason, /diverged/)
  })

  it('rejects a stale staging branch', () => {
    const decision = decide('behind', 0)

    assert.equal(decision.kind, 'blocked')
    assert.match(decision.reason, /behind/)
  })
})

describe('getBranchSyncLinks', () => {
  it('builds GitHub compare and branch links', () => {
    const links = getBranchSyncLinks({
      owner: 'logos-co',
      productionBranch: 'master',
      repo: 'logos-co',
      stagingBranch: 'develop',
    })

    assert.equal(
      links.compareUrl,
      'https://github.com/logos-co/logos-co/compare/master...develop'
    )
    assert.equal(
      links.productionBranchUrl,
      'https://github.com/logos-co/logos-co/tree/master'
    )
    assert.equal(
      links.stagingBranchUrl,
      'https://github.com/logos-co/logos-co/tree/develop'
    )
  })
})
