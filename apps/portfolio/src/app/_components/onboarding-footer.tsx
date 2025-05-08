'use client'

import { useRef, useState } from 'react'

import { Tabs } from '@status-im/components'

import * as Drawer from './drawer'

type OnboardingFooterProps = {
  privacyContent: React.ReactNode
  termsContent: React.ReactNode
}

export function OnboardingFooter({
  privacyContent,
  termsContent,
}: OnboardingFooterProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('terms')
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="mt-auto flex shrink-0 flex-wrap gap-1 text-13">
      <Drawer.Root modal open={open} onOpenChange={setOpen}>
        <div className="inline-flex flex-wrap text-13">
          <p className="w-fit">By proceeding you accept Status</p>&nbsp;
          <Drawer.Trigger
            asChild
            onClick={() => {
              setTab('terms')
            }}
          >
            <button className="font-semibold hover:text-neutral-50">
              Terms of Use
            </button>
          </Drawer.Trigger>
          &nbsp;and&nbsp;
          <Drawer.Trigger
            asChild
            onClick={() => {
              setTab('privacy')
            }}
          >
            <button className="font-semibold hover:text-neutral-50">
              Privacy Policy
            </button>
          </Drawer.Trigger>
        </div>

        <Drawer.Content className="overflow-y-auto px-4" ref={contentRef}>
          <Tabs.Root
            size="24"
            variant="grey"
            defaultValue={tab}
            onValueChange={() => contentRef.current?.scrollTo(0, 0)}
          >
            <Drawer.Header className="sticky top-0 z-20 -mx-4 bg-white-60 px-4 pb-3 pt-4 backdrop-blur-[20px]">
              <Drawer.Title className="!pb-0">
                Status portfolio legal bits
              </Drawer.Title>
              <Drawer.Close />

              <div className="pt-3">
                <Tabs.List>
                  <Tabs.Trigger value="terms">Terms of Use</Tabs.Trigger>

                  <Tabs.Trigger value="privacy">Privacy Policy</Tabs.Trigger>
                </Tabs.List>
              </div>
            </Drawer.Header>

            <div className="py-4">
              <Tabs.Content value="terms">{termsContent}</Tabs.Content>
              <Tabs.Content value="privacy">{privacyContent}</Tabs.Content>
            </div>
          </Tabs.Root>
        </Drawer.Content>
      </Drawer.Root>
    </div>
  )
}
