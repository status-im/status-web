import { useState } from 'react'

import { Button, Input } from '@status-im/components'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

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
    <div>
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
    register,
    // handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const { createWalletAsync } = useCreateWallet()

  // const onSubmit = handleSubmit(async data => {
  //   // const wallet = await createWalletAsync(data.password)
  //   // console.log(wallet.mnemonic().split(' '))
  //   // onNext(wallet)
  // })

  return (
    <div className="flex flex-col gap-4">
      {/* @ts-expect-error: fixme: Types of property 'onChange' are incompatible. */}
      <Input
        label="New password"
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
        label="Confirm password"
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
      <Button
        variant="danger"
        onClick={async () => {
          const wallet = await createWalletAsync('password')
          console.log(wallet)
          onNext(wallet)
        }}
      >
        Continue
      </Button>
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
