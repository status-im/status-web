import { describe, expect, it } from 'vitest'

import { personalMessageBytes, personalMessageText } from './personal-message'

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

describe('personalMessageText', () => {
  it('shows a hex message as text', () => {
    expect(personalMessageText('0x68c3a96c6c6f')).toBe('héllo')
  })

  it('shows a plain-text message as written', () => {
    expect(personalMessageText('Sign in to example.com')).toBe(
      'Sign in to example.com',
    )
  })

  it('shows bytes that are not UTF-8 as hex', () => {
    const hash =
      '0x5f16f4c7f149ac4f9510d9cf8cf384038ad348b3bcdc01915f95de12df9d1b02'
    expect(personalMessageText(hash)).toBe(hash)
  })
})
