import { useState, useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, useToast } from '@status-im/components'
import { LoadingIcon } from '@status-im/icons/20'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { ColorPicker } from '../_components/color-picker'
import * as Drawer from '../_components/drawer'
import { EmojiPickerInput } from '../_components/emoji-picker-input'
import { Form } from '../_components/forms/form'
import { TextInput } from '../_components/forms/text-input'
import { useAccounts } from '../_providers/accounts-context'
import { AccountEmojiTrigger } from './account-emoji-trigger'
import { DeleteAddressAlert } from './delete-address-alert'

import type { Account } from '../_components/sidenav'
import type { SubmitHandler } from 'react-hook-form'

const multiChainRegex = /^([a-zA-Z0-9]{1,6}:)*0x[a-fA-F0-9]{40}$/
const ensNameRegex = /^([a-zA-Z0-9-]+)\.eth$/

const createAddressSchema = (
  accounts: Account[],
  address: string | undefined
) =>
  z
    .object({
      emoji: z.string().min(1, 'Emoji is required.'),
      name: z.string().max(20).min(1, 'Name is required.'),
      address: z
        .string()
        .refine(v => multiChainRegex.test(v) || ensNameRegex.test(v), {
          message: 'Enter valid ENS or Ethereum address',
        }),
      color: z.enum([
        'blue',
        'purple',
        'orange',
        'army',
        'sky',
        'yellow',
        'pink',
        'copper',
        'camel',
        'magenta',
        'turquoise',
        'yin',
        'yang',
      ]),
    })
    .superRefine((data, ctx) => {
      const filteredAccounts = accounts.filter(
        account => account.address !== address
      )

      if (filteredAccounts.some(account => account.address === data.address)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Address already exists',
          path: ['address'],
        })
      }

      if (filteredAccounts.some(account => account.name === data.name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Name already exists',
          path: ['name'],
        })
      }

      if (
        filteredAccounts.some(
          account =>
            account.emoji === data.emoji && account.color === data.color
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Emoji and colour combination already used',
          path: ['color'],
        })
      }
    })

type FormValues = z.infer<ReturnType<typeof createAddressSchema>>

type Props = {
  title: string
  children: React.ReactElement
  onSubmit: SubmitHandler<FormValues>
  successMessage: string
  variant: 'create' | 'edit'
  defaultValues: FormValues
}

const AddressDrawer = (props: Props) => {
  const { title, children, onSubmit, successMessage, variant, defaultValues } =
    props

  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const toast = useToast()

  const handleSubmit: SubmitHandler<FormValues> = async data => {
    try {
      startTransition(async () => {
        await onSubmit(data)
        setOpen(false)
        toast.positive(successMessage)
      })
    } catch (error) {
      console.error(error)
      toast.negative('Something went wrong. Please try again later.')
    }
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      {children && <Drawer.Trigger asChild>{children}</Drawer.Trigger>}
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{title}</Drawer.Title>
        </Drawer.Header>
        <AddressForm
          onSubmit={handleSubmit}
          loading={isPending}
          variant={variant}
          defaultValues={defaultValues}
        />
      </Drawer.Content>
    </Drawer.Root>
  )
}

const AddressForm = (
  props: Omit<
    Props,
    | 'children'
    | 'title'
    | 'successMessage'
    | 'errorMessage'
    | 'open'
    | 'onOpenChange'
  > & {
    loading: boolean
    defaultValues: FormValues
  }
) => {
  const toast = useToast()
  const { onSubmit, loading, variant, defaultValues } = props
  const { removeAccount, accounts } = useAccounts()

  const handleRemove = async (address: string) => {
    removeAccount(address)
    toast.positive(`${address} was successfully removed`)
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(createAddressSchema(accounts, defaultValues.address)),
    mode: 'onTouched',
    defaultValues,
  })

  const colorValue = form.watch('color')

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-1 flex-col">
      <Drawer.Body>
        <div
          className="flex flex-1 flex-col gap-4"
          data-customisation={colorValue}
        >
          <EmojiPickerInput name="emoji">
            <AccountEmojiTrigger
              field={{ name: 'emoji', value: form.watch('emoji') }}
            />
          </EmojiPickerInput>
          <TextInput
            label="Address"
            name="address"
            placeholder="Enter ETH address or ENS..."
            disabled={variant === 'edit'}
          />
          <TextInput
            label="Name"
            name="name"
            placeholder="Enter name for address"
            maxLength={20}
          />
          <ColorPicker name="color" />
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        {variant === 'edit' && (
          <div className="grid w-full grid-cols-[1fr_1fr] gap-2">
            <DeleteAddressAlert
              title="Remove address"
              address={defaultValues.address}
              onConfirm={() => handleRemove(defaultValues.address)}
            >
              <Button variant="danger" className="flex flex-1">
                {loading ? (
                  <LoadingIcon color="$white-100" />
                ) : (
                  'Remove address'
                )}
              </Button>
            </DeleteAddressAlert>
            <Button
              className="flex flex-1"
              type="submit"
              variant="primary"
              disabled={loading || !form.formState.isDirty}
            >
              {loading ? <LoadingIcon color="$white-100" /> : 'Save changes'}
            </Button>
          </div>
        )}
        {variant === 'create' && (
          <div className="grid w-full">
            <Button
              variant="primary"
              type="submit"
              disabled={loading || !form.formState.isDirty}
            >
              {loading ? (
                <LoadingIcon color="$white-100" />
              ) : (
                'Add watched address'
              )}
            </Button>
          </div>
        )}
      </Drawer.Footer>
    </Form>
  )
}

export { AddressDrawer, AddressForm }
