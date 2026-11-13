import { describe, expect, it } from 'vitest'

import { isExtensionPageSender } from './extension-sender'

const ID = 'abcdefghijklmnop'
const BASE = `chrome-extension://${ID}/`

describe('isExtensionPageSender', () => {
  it('accepts extension pages', () => {
    expect(
      isExtensionPageSender({ id: ID, url: `${BASE}page.html#/` }, ID, BASE),
    ).toBe(true)
    expect(
      isExtensionPageSender({ id: ID, url: `${BASE}approval.html` }, ID, BASE),
    ).toBe(true)
  })

  it('rejects content scripts in web pages', () => {
    expect(
      isExtensionPageSender({ id: ID, url: 'https://evil.example/' }, ID, BASE),
    ).toBe(false)
  })

  it('rejects other extensions', () => {
    expect(
      isExtensionPageSender(
        { id: 'other', url: 'chrome-extension://other/page.html' },
        ID,
        BASE,
      ),
    ).toBe(false)
  })

  it('rejects lookalike URLs and missing data', () => {
    expect(
      isExtensionPageSender(
        { id: ID, url: `https://x.example/?${BASE}` },
        ID,
        BASE,
      ),
    ).toBe(false)
    expect(isExtensionPageSender({ id: ID }, ID, BASE)).toBe(false)
    expect(isExtensionPageSender(undefined, ID, BASE)).toBe(false)
    expect(isExtensionPageSender({ id: ID, url: BASE }, '', '')).toBe(false)
  })
})
