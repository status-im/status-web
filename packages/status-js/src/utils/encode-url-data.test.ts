import { utf8 } from '@scure/base'
import { describe, expect, test } from 'vitest'

import { encodeUrlData } from './encode-url-data'

import type {
  CommunityChatPreview,
  CommunityPreview,
  UserPreview,
} from '../protos/link-preview_pb'
import type { PlainMessage } from '@bufbuild/protobuf'

describe('community', () => {
  test('A', () => {
    const data = {
      displayName: 'Lorem ipsum dolor sit egestas.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
      membersCount: 1_000_000,
      color: '#4360DF',
    }
    const encodedData = encodeUrlData('community', data, {
      serialization: 'csv',
      compression: 'noop',
      encoding: 'encodeURIComponent',
    })
    const characterLength = countCharacters(data)

    expect(characterLength).toBe(184)
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

  test('E', () => {
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
        serialization: 'protobuf',
        compression: 'brotli',
        encoding: 'base64url',
      }
    )

    expect(encodedData).toBe(
      'G7sAgK0OzJOmo4yssBOBo6ekybWGRw-TDqBpImRzStN66S8_fBx3Wi8-CYpBaDEC98GMkJGEsSFyjBOFTRcZeFtvHzxkKV8QJcbjHpzQfWpGfDia4OjNJC4AIZP5w7_FMpkVkK5bz6NrgKbZ9pt3szpYvtBL8WoKITWKsP-sCRMPMiEP9l-CGQLv6g153IqXJ_Uuk4T2ffHRPA=='
    )
    expect(encodedData).toHaveLength(208)
  })

  test('F', () => {
    const encodedData = encodeUrlData(
      'community',
      {
        displayName: 'Lorem ipsum dolor sit egestas.',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
        membersCount: 1_000_000,
        color: '#4360DF',
        publicKey: 'zQ3shY7r4cAdg4eUF5dfcuCqCFzWmdjHW4SX5hspM9ucAarfU',
      },
      {
        serialization: 'protobuf',
        compression: 'brotli',
        encoding: 'base64url',
      }
    )

    expect(encodedData).toBe(
      'G-4A4J0H2WnpjJPkb2iwqTU8ephUAOGSXVVtTnqhBFgOcrv5AXOPPGAEdowT8kE3XWTgAW_ywUOWnpIkSkzGQ0YHFAu7fE-FKmBTmil0oxrhsM7h3GJZsXIGoSlSUeQbQEt1bbx5t5YL-OBBM8GKqkAQ3DCC9xt2YEXIiBWEgtiKjDULCJrCGtyFLAlWWCpJtuzWxu9Yb2d7b-P0XG7-P22X9ms_76gj3ezg2_muXio-SSfn_x9Of19-7Lx87rYl3h0yEHn5Bg=='
    )
    expect(encodedData).toHaveLength(268)
  })

  describe('max', () => {
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
          serialization: 'protobuf',
          compression: 'brotli',
          encoding: 'base64url',
        }
      )

      expect(encodedData).toBe(
        'G7sAgK0OzJOmo4yssBOBo6ekybWGRw-TDqBpImRzStN66S8_fBx3Wi8-CYpBaDEC98GMkJGEsSFyjBOFTRcZeFtvHzxkKV8QJcbjHpzQfWpGfDia4OjNJC4AIZP5w7_FMpkVkK5bz6NrgKbZ9pt3szpYvtBL8WoKITWKsP-sCRMPMiEP9l-CGQLv6g153IqXJ_Uuk4T2ffHRPA=='
      )
      expect(encodedData).toHaveLength(208)
    })
  })

  describe('mid', () => {
    test('A', () => {
      const encodedData = encodeUrlData(
        'community',
        {
          displayName: 'Lorem ipsum eu.',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et ex eu.',
          membersCount: 500_000,
          color: '#4360DF',
        },
        {
          serialization: 'protobuf',
          compression: 'brotli',
          encoding: 'base64url',
        }
      )

      expect(encodedData).toBe(
        'G2UA-J0Htk1qG1d7YfVJhrl-0BBikkagwtbcoqXJocUgXzQ1QxrbIQ9uG_t_MGFsiHoQhUCCShIAwjqn3CcrdFhUMGQT03NTR6r0E7k3Y3Z6TKSiQy1re8FPXfCwgA7-LOTotWW_rww='
      )
      expect(encodedData).toHaveLength(140)
    })
  })

  describe('min', () => {
    test('A', () => {
      const encodedData = encodeUrlData(
        'community',
        {
          displayName: 'L',
          membersCount: 0,
          color: '#4360DF',
        } as unknown as PlainMessage<CommunityPreview>,
        {
          serialization: 'protobuf',
          compression: 'brotli',
          encoding: 'base64url',
        }
      )

      expect(encodedData).toBe('iwWAGgFMQgcjNDM2MERGAw==')
      expect(encodedData).toHaveLength(24)
    })
  })
})

describe('chat', () => {
  test('A', () => {
    const data = {
      emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      displayName: 'lorem-ipsum-dolore-nulla',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
      color: '#EAB700',
      community: {
        displayName: 'Lorem ipsum dolor sit egestas.',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
        membersCount: 1_000_000,
        color: '#4360DF',
      },
    }
    const encodedData = encodeUrlData('chat', data, {
      serialization: 'protobuf',
      compression: 'brotli',
      encoding: 'base64url',
    })
    const characterLength = countCharacters(data)

    expect(characterLength).toBe(383)
    expect(encodedData).toBe(
      'G_8AYKwKeDJ8lNFUDUMv91LnB3zVmJqbOncP-lRBw2oL2sim1DYaJmLlSOBnEj6C2pzStPxw8-d13Gm9-CQoDUIriLEOhKAmx78H5owyTSTBTlue5zD9csuh3xpC1HlwNX1OrTZcY9tlJt_Pc9t_C9RripV4uVRGtp3ugIgmxDAyjiY4RzgLJnA0spg_PMu4TGYFZOij59Y9QdPsx6DvZnWwfWOU4tUUQmoW0cVnLZh4kAm58fwlmCHwod5V63EpXp7Uq8wL3boV8b3QLms='
    )
    expect(encodedData).toHaveLength(276)
  })

  describe('max', () => {
    test('A', () => {
      const data = {
        emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        displayName: 'lorem-ipsum-dolore-nulla',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
        color: '#EAB700',
        community: {
          displayName: 'Lorem ipsum dolor sit egestas.',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non dui vitae augue elementum laoreet ac pharetra odio. Morbi vestibulum.',
          membersCount: 1_000_000,
          color: '#4360DF',
        },
      }
      const encodedData = encodeUrlData('chat', data, {
        serialization: 'protobuf',
        compression: 'brotli',
        encoding: 'base64url',
      })

      expect(encodedData).toBe(
        'G_8AYKwKeDJ8lNFUDUMv91LnB3zVmJqbOncP-lRBw2oL2sim1DYaJmLlSOBnEj6C2pzStPxw8-d13Gm9-CQoDUIriLEOhKAmx78H5owyTSTBTlue5zD9csuh3xpC1HlwNX1OrTZcY9tlJt_Pc9t_C9RripV4uVRGtp3ugIgmxDAyjiY4RzgLJnA0spg_PMu4TGYFZOij59Y9QdPsx6DvZnWwfWOU4tUUQmoW0cVnLZh4kAm58fwlmCHwod5V63EpXp7Uq8wL3boV8b3QLms='
      )
      expect(encodedData).toHaveLength(276)
    })
  })

  describe('mid', () => {
    test('A', () => {
      const data = {
        emoji: '💂‍♀️',
        displayName: 'lorem-ipsuma',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et ex eu.',
        color: '#EAB700',
        community: {
          displayName: 'Lorem ipsum eu.',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et ex eu.',
          membersCount: 500_000,
          color: '#4360DF',
        },
      }
      const encodedData = encodeUrlData('chat', data, {
        serialization: 'protobuf',
        compression: 'brotli',
        encoding: 'base64url',
      })

      expect(encodedData).toBe(
        'i0aAEgxsb3JlbS1pcHN1bWEqDfCfkoLigI3imYDvuI8yByNFQUI3MDA6ZhoPTG9yZW0gaXBzdW0gZXUuIkZMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldCwgY29uc2VjdGV0dXIgYWRpcGlzY2luZyBlbGl0LiBTZWQgZXQgZXggZXUuKKDCHkIHIzQzNjBERgM='
      )
      expect(encodedData).toHaveLength(196)
    })
  })

  describe('min', () => {
    test('A', () => {
      const data = {
        emoji: '🫅',
        displayName: 'l',
        color: '#EAB700',
        community: {
          displayName: 'L',
          membersCount: 0,
          color: '#4360DF',
        },
      }
      const encodedData = encodeUrlData(
        'chat',
        data as unknown as PlainMessage<CommunityChatPreview>,
        {
          serialization: 'protobuf',
          compression: 'brotli',
          encoding: 'base64url',
        }
      )

      expect(encodedData).toBe(
        'iw-AEgFsKgTwn6uFMgcjRUFCNzAwOgwaAUxCByM0MzYwREYD'
      )
      expect(encodedData).toHaveLength(48)
    })
  })
})

describe('user', () => {
  test('A', () => {
    const data = {
      displayName: 'Lorem ipsum dolore nulla',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce finibus eleifend urna. Sed euismod tellus vel tellus interdum molestie. Maecenas ut fringilla dui. Duis auctor quis magna at congue. Duis euismod tempor pharetra. Morbi blandit.',
      color: '#EAB700',
    }
    const encodedData = encodeUrlData('user', data, {
      serialization: 'protobuf',
      compression: 'brotli',
      encoding: 'base64url',
    })
    const characterLength = countCharacters(data)

    expect(characterLength).toBe(271)
    expect(encodedData).toBe(
      'GxUBoJwHdsOHgITK206z2oTI6cn2pEtSkxmSJyFKmBF4myq27J1Oe-VxJ_YlRcI4D_AFouMYJ6wzv66LnJ8PjkNGz1Pk70qr7Qlu6Ju9l74z4W0mn-EsI7Ugm_X1x5OzWB2Qpa_mVH9A0xqmcxK3ul6doFFv-kKHy3BcYGvus1A068Q_jaZ6MVZv7GPMUg4UTrokunCH-qNmgtU6VGtCetYJ_MlteVwghXn8aQawLdzvCbw_CVbIwBOX4nqHxmqUOtIB'
    )
    expect(encodedData).toHaveLength(260)
  })

  test('B', () => {
    const data = {
      displayName: 'John',
      description: 'I am John',
      color: '#EAB700',
    }
    const encodedData = encodeUrlData('user', data, {
      serialization: 'protobuf',
      compression: 'brotli',
      encoding: 'base64url',
    })
    const characterLength = countCharacters(data)

    expect(characterLength).toBe(20)
    expect(encodedData).toBe('iwyAEgRKb2huGglJIGFtIEpvaG46ByNFQUI3MDAD')
    expect(encodedData).toHaveLength(40)
  })

  test('C', () => {
    const data = {
      displayName: 'John',
      description: 'I am John',
      color: '#EAB700',
    }
    const encodedData = encodeUrlData('user', data, {
      serialization: 'csv',
      compression: 'brotli',
      encoding: 'base64url',
    })
    const characterLength = countCharacters(data)

    expect(characterLength).toBe(20)
    expect(encodedData).toBe('iwqASm9obixJIGFtIEpvaG4sI0VBQjcwMAM=')
    expect(encodedData).toHaveLength(36)
  })

  test('D', () => {
    const data = {
      displayName: 'John',
      description: 'I am John',
      color: '#EAB700',
    }
    const encodedData = encodeUrlData('user', data, {
      serialization: 'csv',
      compression: 'noop',
      encoding: 'encodeURIComponent',
    })
    const characterLength = countCharacters(data)

    expect(characterLength).toBe(20)
    expect(encodedData).toBe('John%2CI%20am%20John%2C%23EAB700')
    expect(encodedData).toHaveLength(32)
  })

  describe('max', () => {
    test('A', () => {
      const data = {
        displayName: 'Lorem ipsum dolore nulla',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce finibus eleifend urna. Sed euismod tellus vel tellus interdum molestie. Maecenas ut fringilla dui. Duis auctor quis magna at congue. Duis euismod tempor pharetra. Morbi blandit.',
        color: '#EAB700',
      }
      const encodedData = encodeUrlData('user', data, {
        serialization: 'protobuf',
        compression: 'brotli',
        encoding: 'base64url',
      })

      expect(encodedData).toBe(
        'GxUBoJwHdsOHgITK206z2oTI6cn2pEtSkxmSJyFKmBF4myq27J1Oe-VxJ_YlRcI4D_AFouMYJ6wzv66LnJ8PjkNGz1Pk70qr7Qlu6Ju9l74z4W0mn-EsI7Ugm_X1x5OzWB2Qpa_mVH9A0xqmcxK3ul6doFFv-kKHy3BcYGvus1A068Q_jaZ6MVZv7GPMUg4UTrokunCH-qNmgtU6VGtCetYJ_MlteVwghXn8aQawLdzvCbw_CVbIwBOX4nqHxmqUOtIB'
      )
      expect(encodedData).toHaveLength(260)
    })
  })

  describe('mid', () => {
    test('A', () => {
      const data = {
        displayName: 'Lorem ipsuma',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae urna sagittis, maximus metus in, finibus lacus sed.',
        color: '#EAB700',
      }
      const encodedData = encodeUrlData('user', data, {
        serialization: 'protobuf',
        compression: 'brotli',
        encoding: 'base64url',
      })

      expect(encodedData).toBe(
        'G5AAYBwJdmzJcOxhPUKlJ4MEk6lL4QNedFJp9LSDbcKdfT-WnaoBAxtw4JBRIDpttPDVyOSjpLrzeqQZ3LTNcvqj_PdKg8zJHMK6aAqWrB2QyI0auBSkidbj2zQk_GiS0I5FoFJoRnVbh4o5mc7FIXOhb4pJQtMaU-zv3fnzeF4A'
      )
      expect(encodedData).toHaveLength(172)
    })
  })

  describe('min', () => {
    test('A', () => {
      const data = {
        displayName: 'Lorem',
        color: '#EAB700',
      }
      const encodedData = encodeUrlData(
        'user',
        data as unknown as PlainMessage<UserPreview>,
        {
          serialization: 'protobuf',
          compression: 'brotli',
          encoding: 'base64url',
        }
      )

      expect(encodedData).toBe('iweAEgVMb3JlbToHI0VBQjcwMAM=')
      expect(encodedData).toHaveLength(28)
    })
  })
})

// function countCharacters(data: Record<string, string | number>): number {
function countCharacters(data: object): number {
  return Object.values(data).reduce((a, v) => {
    if (typeof v === 'object') {
      return a + countCharacters(v)
    }

    return a + utf8.decode(v.toString()).length
  }, 0)
}
