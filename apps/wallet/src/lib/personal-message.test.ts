import { describe, expect, it } from 'vitest'

import { personalMessageBytes } from './personal-message'

const text = (value: string) => new TextEncoder().encode(value)

describe('personalMessageBytes', () => {
  it('decodes a hex message', () => {
    expect(personalMessageBytes('0x68656c6c6f')).toEqual(text('hello'))
  })

  it('encodes a plain-text message as UTF-8', () => {
    expect(personalMessageBytes('Sign in to example.com')).toEqual(
      text('Sign in to example.com'),
    )
  })

  it('encodes text that only starts like hex as UTF-8', () => {
    expect(personalMessageBytes('0xhello')).toEqual(text('0xhello'))
  })

  it('reads 0x as an empty message', () => {
    expect(personalMessageBytes('0x')).toEqual(new Uint8Array())
  })
})
