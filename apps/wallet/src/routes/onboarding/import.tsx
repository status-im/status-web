import { useState } from 'react'

import { Button, Input } from '@status-im/components'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { useImportWallet } from '../../hooks/use-import-wallet'

export const Route = createFileRoute('/onboarding/import')({
  component: RouteComponent,
})

type OnboardingState =
  | {
      type: 'import-wallet'
      mnemonic: string
    }
  | {
      type: 'create-password'
      mnemonic: string
    }

function RouteComponent() {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    type: 'import-wallet',
    mnemonic: '',
  })

  return (
    <div>
      {onboardingState.type === 'import-wallet' && (
        <ImportWallet
          onNext={mnemonic =>
            setOnboardingState({ type: 'create-password', mnemonic })
          }
        />
      )}
      {onboardingState.type === 'create-password' && (
        <CreatePassword mnemonic={onboardingState.mnemonic} />
      )}
    </div>
  )
}

function ImportWallet({ onNext }: { onNext: (mnemonic: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      mnemonic: '',
    },
  })

  const onSubmit = handleSubmit(data => {
    onNext(data.mnemonic)
  })

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="h-32 rounded-12 border border-neutral-80 bg-neutral-90 p-2 text-white-100 placeholder:text-neutral-40 dark:border-neutral-60 dark:bg-neutral-100"
        placeholder="Enter your recovery phrase"
        {...register('mnemonic', {
          required: 'Recovery phrase is required',
        })}
      />
      {errors.mnemonic && (
        <p className="text-13 text-danger-50">{errors.mnemonic.message}</p>
      )}
      <Button variant="danger" onClick={onSubmit}>
        Continue
      </Button>
    </div>
  )
}

function CreatePassword({ mnemonic }: { mnemonic: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const { importWalletAsync } = useImportWallet()

  const onSubmit = handleSubmit(async data => {
    await importWalletAsync({
      mnemonic,
      password: data.password,
    })
  })

  return (
    <div className="flex flex-col gap-4">
      {/* @ts-expect-error: fixme: Types of property 'onChange' are incompatible. */}
      <Input
        type="password"
        placeholder="New password"
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
        })}
      />
      {errors.password && (
        <p className="text-13 text-danger-50">{errors.password.message}</p>
      )}
      {/* @ts-expect-error: fixme: Types of property 'onChange' are incompatible. */}
      <Input
        type="password"
        placeholder="Confirm password"
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: value =>
            value === watch('password') || 'Passwords do not match',
        })}
      />
      {errors.confirmPassword && (
        <p className="text-13 text-danger-50">
          {errors.confirmPassword.message}
        </p>
      )}
      <Button variant="danger" onClick={onSubmit}>
        Import Wallet
      </Button>
    </div>
  )
}
