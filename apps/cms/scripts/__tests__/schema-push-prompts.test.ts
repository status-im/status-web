import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  createAutoSubmitState,
  isLocalSchemaPushAutomationAllowed,
  shouldSubmitDefaultSchemaChoice,
} from '../schema-push-prompts'

describe('schema push prompt automation', () => {
  it('submits the default choice for Drizzle table rename prompts', () => {
    const state = createAutoSubmitState()

    const shouldSubmit = shouldSubmitDefaultSchemaChoice(
      [
        'Is payload.media table created or renamed from another table?',
        '+ payload.media create table',
        '~ payload.site_settings > payload.media rename table',
      ].join('\n'),
      state,
      1000
    )

    assert.equal(shouldSubmit, true)
  })

  it('submits the default choice for Drizzle column rename prompts', () => {
    const state = createAutoSubmitState()

    const shouldSubmit = shouldSubmitDefaultSchemaChoice(
      [
        'Is page column in pages table created or renamed from another column?',
        '+ page create column',
        '~ content > page rename column',
      ].join('\n'),
      state,
      1000
    )

    assert.equal(shouldSubmit, true)
  })

  it('does not repeatedly submit while the same prompt is pending', () => {
    const state = createAutoSubmitState()
    const output =
      'Is payload.media table created or renamed from another table?'

    assert.equal(shouldSubmitDefaultSchemaChoice(output, state, 1000), true)
    assert.equal(shouldSubmitDefaultSchemaChoice(output, state, 1200), false)
  })

  it('allows the next schema prompt after a previous prompt resolved', () => {
    const state = createAutoSubmitState()

    assert.equal(
      shouldSubmitDefaultSchemaChoice(
        'Is payload.media table created or renamed from another table?',
        state,
        1000
      ),
      true
    )

    assert.equal(
      shouldSubmitDefaultSchemaChoice(
        '+ media table will be created',
        state,
        1200
      ),
      false
    )

    assert.equal(
      shouldSubmitDefaultSchemaChoice(
        'Is payload.builder_resources table created or renamed from another table?',
        state,
        1300
      ),
      true
    )
  })
})

describe('schema push automation environment guard', () => {
  it('allows local development only', () => {
    assert.equal(
      isLocalSchemaPushAutomationAllowed({ NODE_ENV: 'development' }),
      true
    )
  })

  it('blocks production runtime', () => {
    assert.equal(
      isLocalSchemaPushAutomationAllowed({ NODE_ENV: 'production' }),
      false
    )
  })

  it('blocks Vercel staging and preview runtimes', () => {
    assert.equal(
      isLocalSchemaPushAutomationAllowed({
        NODE_ENV: 'development',
        VERCEL: '1',
        VERCEL_ENV: 'preview',
      }),
      false
    )
  })
})
