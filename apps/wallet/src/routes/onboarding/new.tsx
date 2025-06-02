import { useState } from 'react'

import { Button, Input, Switch } from '@status-im/components'
import { ArrowLeftIcon, InfoIcon } from '@status-im/icons/20'
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
  const [isDefaultWallet, setIsDefaultWallet] = useState(true)
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
      {/* @ts-expect-error: fixme: Types of property 'onChange' are incompatible. */}
      <Input
        type="password"
        placeholder="Type password"
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
      <div className="flex items-center gap-1 text-13 text-neutral-50">
        <InfoIcon /> Minimum 10 characters
      </div>

      {/* @ts-expect-error: fixme: Types of property 'onChange' are incompatible. */}
      <Input
        type="password"
        placeholder="Repeat password"
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
      <div className="mt-auto flex flex-col gap-5">
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
          onClick={async () => {
            const wallet = await createWalletAsync('password')
            console.log(wallet)
            onNext(wallet)
          }}
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
