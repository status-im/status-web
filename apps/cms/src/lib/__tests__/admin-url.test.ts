import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { stripAdminNotFoundParam } from '../admin-url'

describe('stripAdminNotFoundParam', () => {
  it('removes Payload notFound noise from admin collection URLs', () => {
    const url = new URL(
      'https://cms.example.com/admin/collections/circles?notFound=5&depth=1&limit=10'
    )

    const result = stripAdminNotFoundParam(url)

    assert.equal(
      result?.toString(),
      'https://cms.example.com/admin/collections/circles?depth=1&limit=10'
    )
  })

  it('does not redirect admin URLs without notFound', () => {
    const url = new URL(
      'https://cms.example.com/admin/collections/circles?depth=1&limit=10'
    )

    assert.equal(stripAdminNotFoundParam(url), null)
  })

  it('does not redirect non-admin URLs', () => {
    const url = new URL('https://cms.example.com/api/example?notFound=5')

    assert.equal(stripAdminNotFoundParam(url), null)
  })
})
