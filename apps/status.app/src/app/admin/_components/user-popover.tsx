import { useState } from 'react'

import * as Popover from '@radix-ui/react-popover'
import { LogOutIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import Image from 'next/image'

import { signOut } from '../_actions'

import type { ApiOutput } from '~server/api/types'

type Props = {
  user: ApiOutput['user']
}

const UserPopover = (props: Props) => {
  const { user } = props
  const { email } = user
  // todo:
  const image = null
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover.Root onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <div className="flex cursor-pointer select-none items-center">
          <div
            className={cx(
              'flex size-8 items-center justify-center rounded-12 border transition',
              isOpen
                ? 'border-neutral-80 opacity-[40%]'
                : 'border-transparent opacity-[100%]'
            )}
          >
            {image ? (
              <Image
                src={image}
                // alt={name}
                alt={email}
                className={cx([
                  'transition',
                  isOpen ? 'rounded-8' : 'rounded-full',
                ])}
                width={24}
                height={24}
              />
            ) : (
              <div
                className={cx([
                  'size-6 bg-customisation-blue-50 transition',
                  'flex items-center justify-center',
                  isOpen ? 'rounded-8' : 'rounded-full',
                ])}
              >
                <p className="text-13 font-semibold uppercase text-white-100">
                  {/* {name.slice(0, 2).toUpperCase()} */}
                  {email.slice(0, 2).toUpperCase()}
                </p>
              </div>
            )}
          </div>
        </div>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side={'bottom'}
          sideOffset={4}
          collisionPadding={24}
          className="z-20 m-auto mb-0 w-full min-w-[296px] max-w-[480px] rounded-12 border border-neutral-10 bg-white-100 shadow-3 data-[state=closed]:animate-explanationOut data-[state=open]:animate-explanationIn"
        >
          <div className="p-3">
            {/* <p className="text-15 font-500">{name}</p> */}
            <p className="text-13 font-500 text-neutral-50">{email}</p>
          </div>
          <div className="border-t border-neutral-10 p-3">
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 text-danger-50"
              >
                <LogOutIcon />
                <p className="text-15 font-500">Log out</p>
              </button>
            </form>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export { UserPopover }
