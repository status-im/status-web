import { cx } from 'class-variance-authority'

import { usePasswordStrength } from './hooks/use-password-strength'
import { PasswordStrengthIndicator } from './indicator'

type Props = {
  password: string
}

const PasswordStrength = ({ password }: Props) => {
  const { score, label, color, requirements } = usePasswordStrength(password)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {password.length <= 0 ? (
          <div className="text-13 text-neutral-50">
            Tip: Include a mixture of numbers, capitals and symbols
          </div>
        ) : (
          <div className={cx('flex items-center gap-1', color)}>
            <PasswordStrengthIndicator score={score} />
            <span className={cx('text-13 font-medium', color)}>{label}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1">
        {requirements.map((requirement, index) => (
          <div
            key={index}
            className="flex w-full items-center justify-between text-neutral-50"
          >
            <span
              className={cx(requirement.rule && 'text-neutral-30 line-through')}
            >
              {requirement.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { PasswordStrength }
