import { useState, useTransition } from 'react'

import { Button, Input, Text } from '@status-im/components'
import { ArrowLeftIcon } from '@status-im/icons/20'
import {
  ImportRecoveryForm,
  type MnemonicFormData,
} from '@status-im/wallet/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { useImportWallet } from '../../hooks/use-import-wallet'

import type { SubmitHandler } from 'react-hook-form'

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
  const [onboardingState /*, setOnboardingState*/] = useState<OnboardingState>({
    type: 'import-wallet',
    mnemonic: '',
  })

  return (
    <div className="h-full">
      {onboardingState.type === 'import-wallet' && (
        <ImportWallet
        // onNext={mnemonic => {
        //   setOnboardingState({ type: 'create-password', mnemonic })
        // }}
        />
      )}
      {onboardingState.type === 'create-password' && (
        <CreatePassword mnemonic={onboardingState.mnemonic} />
      )}
    </div>
  )
}

function ImportWallet() {
  const [isPending, startTransition] = useTransition()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<MnemonicFormData> = async data => {
    try {
      startTransition(async () => {
        navigate({ to: '/onboarding/new', state: { mnemonic: data.mnemonic } })
        // onNext?(mnemonic)
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex h-full flex-col gap-1">
        <div className="pb-4">
          <Button
            href="/onboarding"
            variant="grey"
            icon={<ArrowLeftIcon color="$neutral-100" />}
            aria-label="Back"
            size="32"
          />
        </div>
        <Text size={27} weight="semibold">
          Import via recovery phrase
        </Text>
        <Text size={15} color="$neutral-50" className="mb-4">
          Type or paste your 12, 15, 18, 21 or 24 words Ethereum recovery phrase
        </Text>

        <ImportRecoveryForm onSubmit={onSubmit} loading={isPending} />
      </div>
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
      <Button variant="primary" onClick={onSubmit}>
        Import Wallet
      </Button>
    </div>
  )
}
