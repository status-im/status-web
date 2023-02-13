import { describe, expect, test } from 'vitest'

import { encodeUrlData } from './encode-url-data'

describe('community', () => {
  test('A', () => {
    const encodedData = encodeUrlData(
      'community',
      {
        displayName: 'Lorem ipsum dolor sit egestas.',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
        membersCount: 1_000_000,
        color: '#4360DF',
      },
      {
        serialization: 'csv',
        compression: 'noop',
        encoding: 'encodeURIComponent',
      }
    )

    expect(encodedData).toBe(
      'Lorem%20ipsum%20dolor%20sit%20egestas.%2CLorem%20ipsum%20dolor%20sit%20amet%2C%20consectetur%20adipiscing%20elit.%20Phasellus%20non%20dui%20vitae%20augue%20elementum%20laoreet%20ac%20pharetra%20odio.%20Morbi%20vestibulum.%2C1000000%2C%234360DF'
    )
    expect(encodedData).toHaveLength(243)
  })

  test('B', () => {
    const encodedData = encodeUrlData(
      'community',
      {
        displayName: 'Lorem ipsum dolor sit egestas.',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
        membersCount: 1_000_000,
        color: '#4360DF',
      },
      {
        serialization: 'csv',
        compression: 'noop',
        encoding: 'base58',
      }
    )

    expect(encodedData).toBe(
      '2PPnX9fDBvMJvWY5SnfmebN2ewvTW6yzhdJAVTRr3ui3QwzDf1R3GWN27cJ4L9dVZSmbs7tHjwPKfWzSEe2b4viHv7u8KYVFnYpNNS8GDFajUjBd9JuVkHRpEiR9rY7AgNU6CPUKMGDP2URUB9ovMY9KEFkJjpEEzVYTeMq1xuqfTm52nKayo336zDdQM9doCr2x6rL8WBFG2EjcKa7m2P1r2SfBFzvjWpET9LvDuszuJQWieQNbePkcGS6TRCRB'
    )
    expect(encodedData).toHaveLength(256)
  })

  test('C', () => {
    const encodedData = encodeUrlData(
      'community',
      {
        displayName: 'Lorem ipsum dolor sit egestas.',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
        membersCount: 1_000_000,
        color: '#4360DF',
      },
      {
        serialization: 'csv',
        compression: 'noop',
        encoding: 'base64url',
      }
    )

    expect(encodedData).toBe(
      'TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGVnZXN0YXMuLExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQuIFBoYXNlbGx1cyBub24gZHVpIHZpdGFlIGF1Z3VlIGVsZW1lbnR1bSBsYW9yZWV0IGFjIHBoYXJldHJhIG9kaW8uIE1vcmJpIHZlc3RpYnVsdW0uLDEwMDAwMDAsIzQzNjBERg=='
    )
    expect(encodedData).toHaveLength(252)
  })

  test('D', () => {
    const encodedData = encodeUrlData(
      'community',
      {
        displayName: 'Lorem ipsum dolor sit egestas.',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
        membersCount: 1_000_000,
        color: '#4360DF',
      },
      {
        serialization: 'csv',
        compression: 'brotli',
        encoding: 'base64url',
      }
    )

    expect(encodedData).toBe(
      'G7oA4J0Htk1quxOPrPZpDHNJw9RkbkrTevCrOO5pPfxANBKT1oxRwtgQOeWAPcQSzSTgANtB7jH2huWQRVoeXNBza6V7uZrgrMw0GhZkMRuOLY7JrIAMPXpf3RM0zT7cfDeri-0boxSfphBSswje37Vg4kEm5MX5SzBD4EO9Y49H8fGmPmW1evMEqIN_5A=='
    )
    expect(encodedData).toHaveLength(192)
  })
})
