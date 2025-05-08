'use client'

import { useState } from 'react'

import { Avatar, Button } from '@status-im/components'
import { CheckIcon, CopyIcon } from '@status-im/icons/20'
import { QRCodeSVG } from 'qrcode.react'

import * as Drawer from '../drawer'

import type { Account } from '../address'
import type React from 'react'

type Props = {
  children: React.ReactNode
  account?: Account
  onCopy?: (address: string) => void
}

export const ReceiveCryptoDrawer = (props: Props) => {
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const { account, children, onCopy } = props

  if (!account) {
    return null
  }

  return (
    <Drawer.Root modal open={open} onOpenChange={setOpen}>
      {children && <Drawer.Trigger asChild>{children}</Drawer.Trigger>}

      <Drawer.Content className="overflow-y-auto p-3">
        <Drawer.Header className="sticky top-1 flex flex-col bg-white-60 px-1 pb-3 pt-1 backdrop-blur-[20px]">
          <Drawer.Title>Receive</Drawer.Title>
          <div
            className="inline-flex h-6 items-center gap-1 self-start rounded-8 border bg-neutral-10 pl-px pr-2"
            data-customisation={account.color}
          >
            <div className="rounded-6 bg-white-100">
              <Avatar
                type="account"
                name={account.name}
                emoji={account.emoji}
                size="20"
                bgOpacity="20"
              />
            </div>
            <span className="text-13 font-medium text-neutral-100">
              {account.name}
            </span>
          </div>
        </Drawer.Header>
        <div
          data-customisation={account.color}
          className="grid gap-3 rounded-16 bg-customisation-50/5 p-3"
        >
          <div className="relative flex h-[444px] items-center justify-center overflow-hidden rounded-16 bg-white-100 shadow-3">
            <QRCodeSVG value={account.address} size={408} className="" />
            <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform rounded-16 bg-white-100">
              <Avatar
                type="account"
                emoji={account.emoji}
                size="80"
                name={account.name}
                bgOpacity="20"
              />
            </div>
          </div>
          <div className="flex items-center justify-between font-mono text-15 text-neutral-50">
            {account.address}{' '}
            <Button
              variant="outline"
              onClick={() => {
                onCopy?.(account.address)
                setSuccess(true)
              }}
              size="32"
              icon={
                success ? (
                  <CheckIcon className="text-success-50" />
                ) : (
                  <CopyIcon className="text-neutral-50" />
                )
              }
              aria-label="Copy code"
            />
          </div>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  )
}
