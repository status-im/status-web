import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Text } from '@status-im/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { validateMnemonic } from 'bip39'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Header from '@/components/header'
import TextArea from '@/components/TextArea'

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

  const navigate = useNavigate()

  return (
    <div className="h-full">
      {onboardingState.type === 'import-wallet' && (
        <ImportWallet
          onNext={mnemonic => {
            setOnboardingState({ type: 'create-password', mnemonic })
            navigate({ to: '/portfolio' })
          }}
        />
      )}
      {onboardingState.type === 'create-password' && (
        <CreatePassword mnemonic={onboardingState.mnemonic} />
      )}
    </div>
  )
}

function ImportWallet({ onNext }: { onNext: (mnemonic: string) => void }) {
  const mnemonicSchema = z.object({
    mnemonic: z.string().refine(value => validateMnemonic(value), {
      message: 'Invalid phrase. Check word count and spelling.',
    }),
  })

  type MnemonicFormData = z.infer<typeof mnemonicSchema>

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<MnemonicFormData>({
    defaultValues: {
      mnemonic: '',
    },
    mode: 'onChange',
    resolver: zodResolver(mnemonicSchema),
  })

  const onSubmit = handleSubmit(data => {
    onNext(data.mnemonic)
  })

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex flex-col gap-1">
        <Header />
        <Text size={27} weight="semibold">
          Import via recovery phrase
        </Text>
        <Text size={15} color="$neutral-50">
          Type or paste your 12, 15, 18, 21 or 24 words Ethereum recovery phrase
        </Text>
        <TextArea
          placeholder="Recovery phrase"
          control={control}
          name="mnemonic"
        />
      </div>
      <div className="flex flex-col gap-6">
        {errors.mnemonic && (
          <p className="text-13 text-danger-50">{errors.mnemonic.message}</p>
        )}
        <Button variant="primary" onClick={onSubmit} disabled={!isValid}>
          Continue
        </Button>
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
