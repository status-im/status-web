import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { matchesRecentPullRequestScope } from '../recent-pr-matching'

describe('matchesRecentPullRequestScope', () => {
  it('matches fixed target paths even when the document slug is not in the path', () => {
    assert.equal(
      matchesRecentPullRequestScope(
        {
          branchName: 'content/site-settings-settings-20260518',
          targetPath: 'content/site/en/settings.json',
        },
        {
          slug: 'settings',
          targetPath: 'content/site/en/settings.json',
        }
      ),
      true
    )
  })

  it('matches single-file page target paths that do not contain slash-wrapped slugs', () => {
    assert.equal(
      matchesRecentPullRequestScope(
        {
          branchName: 'content/page-about-20260518',
          targetPath: 'content/pages/en/about.json',
        },
        {
          slug: 'about',
          targetPath: 'content/pages/en/about.json',
        }
      ),
      true
    )
  })

  it('falls back to slug matching when there is no resolved target path', () => {
    assert.equal(
      matchesRecentPullRequestScope(
        {
          branchName: 'content/idea-quadratic-voting-20260518',
          targetPath: 'content/builders-hub/ideas/quadratic-voting/index.json',
        },
        {
          slug: 'quadratic-voting',
        }
      ),
      true
    )
  })
})
