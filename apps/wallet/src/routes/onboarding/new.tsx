import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Text } from '@status-im/components'
import { InfoIcon } from '@status-im/icons/12'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import passwordIcon from '@/assets/Illustration.png'
import Progress from '@/assets/progress'
import Header from '@/components/header'
import TextField from '@/components/TextField'
import usePasswordStrength from '@/hooks/usePasswordStrength'

export const Route = createFileRoute('/onboarding/new')({
  component: RouteComponent,
})

type OnboardingState =
  | { type: 'create-password' }
  | { type: 'recovery-phrase'; mnemonic: string }

function RouteComponent() {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    type: 'create-password',
  })

  return (
    <div className="h-full">
      {onboardingState.type === 'create-password' && (
        <CreatePassword
          onNext={mnemonic =>
            setOnboardingState({ type: 'recovery-phrase', mnemonic })
          }
        />
      )}
      {onboardingState.type === 'recovery-phrase' && (
        <RecoveryPhrase mnemonic={onboardingState.mnemonic} />
      )}
    </div>
  )
}

function CreatePassword({ onNext }: { onNext: (wallet: string) => void }) {
  const {
    control,
    getValues,
    watch,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(
      z
        .object({
          password: z
            .string()
            .min(10, 'Password must be at least 10 characters'),
          confirmPassword: z.string(),
        })
        .refine(data => data.password === data.confirmPassword, {
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        }),
    ),
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')
  const disabled =
    Object.values(errors).length > 0 ||
    Object.values(touchedFields).length !== Object.keys(getValues()).length
  const { passwordStrength, isPasswordValid } = usePasswordStrength(password)
  const { createWalletAsync } = useCreateWallet()

  const onSubmit = handleSubmit(async (data: { password: string }) => {
    if (!disabled || !isPasswordValid) {
      return
    }
    const wallet = await createWalletAsync(data.password)
    onNext(wallet)
  })

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-1">
        <Header className="mb-4" />
        <img src={passwordIcon} alt="password-icon" className="mb-3 size-12" />
        <Text size={27} weight="semibold">
          Create password
        </Text>
        <Text size={15} color="$neutral-50">
          To unlock the extension and sign transactions
        </Text>
        <div className="mt-4 flex flex-col gap-2">
          <TextField
            type="password"
            name="password"
            placeholder="Type password"
            control={control}
          />
          <p
            className={`mb-2 flex items-center gap-1 text-13 ${errors.password ? 'text-danger-50' : 'text-neutral-50'} ${password.length >= 10 && 'text-success-50'}`}
          >
            <InfoIcon className="size-3.5" />
            <span>Minimum 10 characters</span>
          </p>
          <TextField
            name="confirmPassword"
            control={control}
            type="password"
            placeholder="Repeat password"
          />
        </div>
        {touchedFields.confirmPassword && confirmPassword && (
          <p
            className={`mb-2 flex items-center gap-1 text-13 ${errors.confirmPassword ? 'text-danger-50' : 'text-success-50'}`}
          >
            <InfoIcon className="size-3.5" />
            <span>
              {errors.confirmPassword
                ? errors.confirmPassword.message
                : 'Passwords match'}
            </span>
          </p>
        )}
      </div>
      <div className="flex flex-col gap-3">
        {!disabled ? (
          <div className="mb-2 flex items-center gap-2 rounded-12 border border-customisation-blue-50/[.1] bg-customisation-blue-60/[.05] px-4 py-2.5 text-neutral-50">
            <InfoIcon className="size-4" />
            <span className="text-13 text-neutral-100">
              Status cannot recover your password for you
            </span>
          </div>
        ) : password ? (
          <div className="flex items-center gap-1">
            <Progress
              stroke={passwordStrength.color}
              progress={passwordStrength.progress}
            />
            <span>{passwordStrength.label}</span>
          </div>
        ) : (
          <span className="text-neutral-50">
            Tip: Include a mixture of numbers, capitals and symbols
          </span>
        )}
        <Button variant="primary" disabled={disabled} onClick={onSubmit}>
          Continue
        </Button>
      </div>
    </div>
  )
}

function RecoveryPhrase({ mnemonic }: { mnemonic: string }) {
  return (
    <div>
      <p>Write down your recovery phrase</p>
      <p>Read the following carefully before continuing</p>

      <div className="grid grid-cols-3 gap-4 rounded-8 bg-neutral-90 p-4">
        {mnemonic.split(' ').map((word, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-neutral-40">{i + 1}.</span>
            <span className="font-mono">{word}</span>
          </div>
        ))}
      </div>

      <Button variant="danger">Continue</Button>
    </div>
  )
}
