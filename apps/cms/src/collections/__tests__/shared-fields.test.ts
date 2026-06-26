import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { collapsibleHasRequiredField } from '../shared-fields'

describe('collapsibleHasRequiredField', () => {
  it('detects direct required fields', () => {
    assert.equal(
      collapsibleHasRequiredField([
        { name: 'optional', type: 'text' },
        { name: 'required', type: 'text', required: true },
      ]),
      true
    )
  })

  it('detects required fields nested in rows and arrays', () => {
    assert.equal(
      collapsibleHasRequiredField([
        {
          type: 'row',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [{ name: 'name', type: 'text', required: true }],
            },
          ],
        },
      ]),
      true
    )
  })

  it('returns false when no nested field is required', () => {
    assert.equal(
      collapsibleHasRequiredField([
        {
          type: 'collapsible',
          label: 'Image',
          fields: [{ name: 'imageSrc', type: 'text' }],
        },
      ]),
      false
    )
  })
})
