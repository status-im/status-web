import { useMemo } from 'react'

import { zxcvbn } from '@zxcvbn-ts/core'

const STRENGTH_LEVELS = {
  0: {
    label: 'Very weak',
    color: 'text-danger-50',
  },
  1: {
    label: 'Weak',
    color: 'text-customisation-orange-60',
  },
  2: {
    label: 'Okay',
    color: 'text-customisation-yellow-50',
  },
  3: {
    label: 'Strong',
    color: 'text-success-50',
  },
  4: {
    label: 'Very strong',
    color: 'text-success-50',
  },
} as const

type StrengthScore = keyof typeof STRENGTH_LEVELS

export const usePasswordStrength = (password: string) => {
  const defaultStrength = STRENGTH_LEVELS[0]

  return useMemo(() => {
    const requirements = [
      {
        label: 'Lowercase',
        rule: /[a-z]/.test(password),
      },
      {
        label: 'Uppercase',
        rule: /[A-Z]/.test(password),
      },
      {
        label: 'Number',
        rule: /[0-9]/.test(password),
      },
      {
        label: 'Symbol',
        rule: /[^a-zA-Z0-9]/.test(password),
      },
    ]

    const result = password ? zxcvbn(password) : { score: 0 }
    const score = result.score as StrengthScore
    const strengthLevel = STRENGTH_LEVELS[score] || defaultStrength

    return {
      requirements,
      score: result.score,
      label: strengthLevel.label,
      color: strengthLevel.color,
      characterCount: password.length,
    }
  }, [password, defaultStrength])
}
