'use client'

import { useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, IconButton } from '@status-im/components'
import { AlertIcon } from '@status-im/icons/16'
import { ArrowRightIcon, ClearIcon } from '@status-im/icons/20'
import { cva } from 'class-variance-authority'
import { useForm } from 'react-hook-form'
// import { mainnet } from 'viem/chains'
// import { normalize } from 'viem/ens'
// import { useEnsAddress } from 'wagmi'
import { z } from 'zod'

import { Form } from '../_components/forms/form'
import { useAccounts } from '../_providers/accounts-context'
import { getRandomColor, getRandomEmoji } from '../_utils/get-default-values'

import type { SubmitHandler } from 'react-hook-form'

const wrapperStyle = cva(
  'group relative flex flex-1 items-center rounded-12 border border-solid px-3 py-2',
  {
    variants: {
      variant: {
        default:
          'border-neutral-20 focus-within:border-neutral-40 hover:border-neutral-40',
        error:
          'border-danger-50/40 focus-within:border-danger-50 hover:border-danger-50',
      },
    },
  }
)

const inputStyle = cva('w-full text-15 font-regular placeholder:font-regular', {
  variants: {
    variant: {
      'paste-button': 'max-w-[calc(100%-60px)]',
      'clear-button': 'max-w-[calc(100%-32px)]',
    },
  },
})

type FormValues = {
  address: string
}

const multiChainRegex = /^([a-zA-Z0-9]{1,6}:)*0x[a-fA-F0-9]{40}$/
const ensNameRegex = /^([a-zA-Z0-9-]+)\.eth$/

const addressSchema = z.object({
  address: z
    .string()
    .refine(v => multiChainRegex.test(v) || ensNameRegex.test(v), {
      message: 'Enter valid ENS or Ethereum address',
    }),
}) satisfies z.ZodType<Pick<FormValues, 'address'>>

const AddressSection = () => {
  const [isPending] = useTransition()

  const { addAccount } = useAccounts()

  const form = useForm<FormValues>({
    resolver: zodResolver(addressSchema),
    mode: 'onTouched',
    defaultValues: {
      address: '',
    },
  })

  // const ensName = 'vitalik.eth'

  // const { data: address, error } = useEnsAddress({
  //   name: normalize(ensName),
  //   chainId: mainnet.id,
  // })

  // if (error) {
  //   console.error(error)
  // }

  // if (address) {
  //   console.log(address)
  // }

  const handleSubmit: SubmitHandler<FormValues> = async data => {
    try {
      addAccount({
        address: data.address.toLowerCase(),
        name: 'Address 1',
        emoji: getRandomEmoji(),
        color: getRandomColor(),
      })
    } catch (error) {
      form.setError('address', {
        type: 'manual',
        message: 'Something went wrong. Please try again later.',
      })
      console.error(error)
    }
  }

  const getAddressFromClipboard = async () => {
    try {
      // Read the text from the clipboard
      const text = await navigator.clipboard.readText()
      form.setValue('address', text, { shouldValidate: true })
    } catch (error) {
      console.warn('Paste failed', error)
    }
  }

  const addressValue = form.watch('address')
  const { isValid } = form.formState

  const errorValue = form.formState.errors.address?.message

  return (
    <Form {...form} onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        <label className="relative inline-flex h-10 w-full gap-2">
          <div
            className={wrapperStyle({
              variant: errorValue ? 'error' : 'default',
            })}
          >
            <input
              {...form.register('address')}
              name="address"
              placeholder="Enter address or ENS"
              size={32}
              className={inputStyle({
                variant: addressValue ? 'clear-button' : 'paste-button',
              })}
            />

            {!addressValue ? (
              <button
                className="absolute right-2 inline-flex items-center justify-center rounded-8 border border-neutral-20 px-2 py-1 text-13 hover:border-neutral-40"
                onClick={getAddressFromClipboard}
                type="button"
              >
                Paste
              </button>
            ) : (
              <div className="absolute right-1 inline-flex">
                <IconButton
                  onPress={() => {
                    form.setValue('address', '', { shouldValidate: true })
                  }}
                  variant="ghost"
                  icon={<ClearIcon className="text-neutral-40" />}
                />
              </div>
            )}
          </div>

          <Button
            disabled={isPending || !isValid}
            type="submit"
            icon={<ArrowRightIcon />}
            aria-label="Submit"
          />
        </label>

        {!!errorValue && (
          <div className="flex gap-1">
            <AlertIcon className="text-danger-50" />
            <div className="text-13 text-danger-50">{errorValue}</div>{' '}
          </div>
        )}
      </div>
    </Form>
  )
}

export { AddressSection }
