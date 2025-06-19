import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  // , Switch
} from '@status-im/components'
import { AlertIcon, InfoIcon, PositiveStateIcon } from '@status-im/icons/16'
import { LoadingIcon } from '@status-im/icons/20'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'

import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  PasswordInput,
} from '../password-input'
import { PasswordStrength } from '../password-strength'

const passwordSchema = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
  )
  .max(
    MAX_PASSWORD_LENGTH,
    `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`,
  )
  .refine(password => /[a-z]/.test(password), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine(password => /[A-Z]/.test(password), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine(password => /[0-9]/.test(password), {
    message: 'Password must contain at least one number',
  })
  .refine(password => /[^a-zA-Z0-9]/.test(password), {
    message: 'Password must contain at least one symbol',
  })

const createPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
    isDefaultWallet: z.boolean().default(true),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof createPasswordSchema>

type CreatePasswordFormProps = {
  onSubmit: (data: FormValues) => void
  loading: boolean
}

const CreatePasswordForm = ({
  onSubmit,
  loading = false,
}: CreatePasswordFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(createPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      password: '',
      confirmPassword: '',
      isDefaultWallet: true,
    },
  })

  const {
    formState: { errors },
  } = form

  const isPasswordValid = form.watch('password').length >= MIN_PASSWORD_LENGTH
  const doPasswordsMatch =
    form.watch('password') === form.watch('confirmPassword')
  const confirmPassword = form.watch('confirmPassword')

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-1 flex-col"
      >
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <PasswordInput
              name="password"
              label="Password"
              placeholder="Type password"
            />

            <div
              className={`mt-2 flex items-center gap-1 text-13 ${
                errors.password
                  ? 'text-danger-50'
                  : isPasswordValid
                    ? 'text-success-50'
                    : 'text-neutral-50'
              }`}
            >
              {errors.password ? (
                <>
                  <AlertIcon /> {errors.password.message}
                </>
              ) : isPasswordValid ? (
                <>
                  <PositiveStateIcon /> Minimum {MIN_PASSWORD_LENGTH} characters
                </>
              ) : (
                <>
                  <InfoIcon /> Minimum {MIN_PASSWORD_LENGTH} characters
                </>
              )}
            </div>
          </div>

          <div>
            <PasswordInput
              name="confirmPassword"
              label="Confirm password"
              placeholder="Repeat password"
            />

            {(confirmPassword || errors.confirmPassword) && (
              <div
                className={`mt-2 flex items-center gap-1 text-13 ${
                  errors.confirmPassword
                    ? 'text-danger-50'
                    : doPasswordsMatch
                      ? 'text-success-50'
                      : 'text-danger-50'
                }`}
              >
                {errors.confirmPassword ? (
                  <>
                    <AlertIcon /> {errors.confirmPassword.message}
                  </>
                ) : doPasswordsMatch ? (
                  <>
                    <PositiveStateIcon /> Passwords match
                  </>
                ) : (
                  <>
                    <AlertIcon /> Passwords do not match
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-5">
            <PasswordStrength password={form.watch('password')} />
            {/* <div className="flex w-full items-center gap-2 rounded-12 border border-neutral-20 bg-neutral-5 px-4 py-3 text-13">
              <div className="text-13">
                Set status as your default wallet to ensure seamless dApp
                connections
              </div>
              <Switch
                {...form.register('isDefaultWallet')}
                checked={form.watch('isDefaultWallet')}
                onCheckedChange={value =>
                  form.setValue('isDefaultWallet', value)
                }
              />
            </div> */}
            <Button
              type="submit"
              disabled={
                !isPasswordValid ||
                !doPasswordsMatch ||
                !!form.formState.errors.password ||
                !!form.formState.errors.confirmPassword
              }
            >
              {loading ? (
                <LoadingIcon className="animate-spin text-white-100" />
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  )
}

export { CreatePasswordForm }
export type { FormValues as CreatePasswordFormValues }
