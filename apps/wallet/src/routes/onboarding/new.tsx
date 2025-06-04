import { useState } from 'react'

import { Button, Input, Switch } from '@status-im/components'
import {
  AlertIcon,
  ArrowLeftIcon,
  HideIcon,
  InfoIcon,
  PositiveStateIcon,
  RevealIcon,
} from '@status-im/icons/20'
// import { PasswordStrength } from '@status-im/wallet/components'
import { createFileRoute } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'

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
    <div className="flex h-full">
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
  const { createWalletAsync } = useCreateWallet()
  const [isDefaultWallet, setIsDefaultWallet] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
      isDefaultWallet: true,
    },
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')
  const isPasswordValid = password.length >= 10
  const doPasswordsMatch = password === confirmPassword

  const onSubmit = handleSubmit(async data => {
    console.log('Form is valid, password:', data.password)
    const wallet = await createWalletAsync(data.password)
    console.log(wallet)
    onNext(wallet)
  })

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Button
          href="/onboarding"
          variant="grey"
          icon={<ArrowLeftIcon color="$neutral-100" />}
          aria-label="Back"
          size="32"
        />
      </div>
      <h1 className="text-27 font-600">Create password</h1>
      <div className="text-15 text-neutral-50">
        To unlock the extension and sign transactions, the password is stored
        only on your device. Status can't recover it.
      </div>

      <div className="relative">
        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 10,
              message: 'Password must be at least 10 characters',
            },
          }}
          render={({ field }) => (
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Type password"
              value={field.value}
              onChange={field.onChange}
              aria-label="Password"
            />
          )}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-40 hover:text-neutral-100"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <HideIcon /> : <RevealIcon />}
        </button>
        <div
          className={`mt-2 flex items-center gap-1 text-13 ${isPasswordValid ? 'text-success-50' : 'text-neutral-50'}`}
        >
          {isPasswordValid ? <PositiveStateIcon /> : <InfoIcon />} Minimum 10
          characters
        </div>
      </div>

      <div className="relative">
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match',
          }}
          render={({ field }) => (
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repeat password"
              value={field.value}
              onChange={field.onChange}
              aria-label="Confirm password"
            />
          )}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-40 hover:text-neutral-100"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <HideIcon /> : <RevealIcon />}
        </button>
        {confirmPassword && (
          <div
            className={`mt-2 flex items-center gap-1 text-13 ${doPasswordsMatch ? 'text-success-50' : 'text-danger-50'}`}
          >
            {doPasswordsMatch ? <PositiveStateIcon /> : <AlertIcon />}
            {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-col gap-5">
        {/* <PasswordStrength password={password} /> */}
        <div className="flex w-full items-center gap-2 rounded-12 border border-neutral-20 bg-neutral-5 px-4 py-3 text-13">
          <div className="text-13">
            Set status as your default wallet to ensure seamless dApp
            connections
          </div>
          <Switch
            checked={isDefaultWallet}
            onCheckedChange={() => setIsDefaultWallet(!isDefaultWallet)}
          />
        </div>
        <Button
          onClick={onSubmit}
          disabled={!isPasswordValid || !doPasswordsMatch}
        >
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
