import { useEffect, useState } from 'react'

type PasswordStrengthLevel = {
  label: string
  color: string
  progress: number
}

type PasswordRequirement = {
  id: string
  label: string
  validate: (password: string) => boolean
}

export const PASSWORD_STRENGTH_LEVELS: PasswordStrengthLevel[] = [
  { label: 'Very weak', color: '#E95460', progress: 20 },
  { label: 'Weak', color: '#CC6438', progress: 40 },
  { label: 'Okay', color: '#F6B03C', progress: 60 },
  { label: 'Strong', color: '#23ADA0', progress: 80 },
  { label: 'Very strong', color: '#23ADA0', progress: 100 },
]

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 10 characters',
    validate: (s: string) => s.length >= 10,
  },
  {
    id: 'number',
    label: 'At least one number',
    validate: (s: string) => /\d/.test(s),
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter',
    validate: (s: string) => /[A-Z]/.test(s),
  },
  {
    id: 'symbol',
    label: 'At least one symbol',
    validate: (s: string) => /[!@#$%^&*(),.?":{}|<>]/.test(s),
  },
]

export default function usePasswordStrength(password: string) {
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrengthLevel>(PASSWORD_STRENGTH_LEVELS[0])
  const [requirementsMet, setRequirementsMet] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    // Calculate password strength based on requirements met
    const metReqs = PASSWORD_REQUIREMENTS.reduce<Record<string, boolean>>(
      (acc, req) => {
        acc[req.id] = req.validate(password)
        return acc
      },
      {},
    )

    setRequirementsMet(metReqs)

    // Calculate strength based on number of requirements met
    const metCount = Object.values(metReqs).filter(Boolean).length
    const strengthIndex = Math.min(
      Math.floor(
        (metCount / PASSWORD_REQUIREMENTS.length) *
          PASSWORD_STRENGTH_LEVELS.length,
      ),
      PASSWORD_STRENGTH_LEVELS.length - 1,
    )
    setPasswordStrength(PASSWORD_STRENGTH_LEVELS[strengthIndex])
  }, [password])

  return {
    passwordStrength,
    requirementsMet,
    requirements: PASSWORD_REQUIREMENTS,
    isPasswordValid: Object.values(requirementsMet).every(Boolean),
  }
}
