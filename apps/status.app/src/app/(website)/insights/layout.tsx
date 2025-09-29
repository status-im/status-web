'use client'

import { useState } from 'react'

import { Text } from '@status-im/components'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { Body } from '~components/body'
import { useMediaQuery } from '~hooks/use-media-query'

import { InsightsSidebarMenu } from './_components/insights-sidebar-menu'
import { NotAllowed } from './_components/not-allowed'

type Props = {
  children: React.ReactNode
}

export default function InsightsLayout({ children }: Props) {
  const [queryClient] = useState(() => new QueryClient())

  const matchesLG = useMediaQuery('xl')

  return (
    <QueryClientProvider client={queryClient}>
      <>
        {matchesLG === true && (
          <Body className="relative flex min-h-[calc(100vh-56px-4px)]">
            <div className="sticky top-0 max-h-screen overflow-y-auto overscroll-y-contain border-r border-neutral-10">
              <InsightsSidebarMenu />
            </div>
            <main className="flex flex-1 flex-col pb-8">{children}</main>
          </Body>
        )}
        {matchesLG == null && (
          <Body className="relative flex min-h-[calc(100vh-56px-4px)] items-center justify-center bg-white-100">
            <div className="flex flex-col items-center justify-center">
              <div
                className="inline-block size-6 animate-spin rounded-full border-[3px] border-t-transparent text-neutral-80"
                role="status"
                aria-label="loading"
              >
                <span className="sr-only">Loading...</span>
              </div>
              <div className="pb-3" />
              <Text size={15} weight="semibold">
                Loading insights...
              </Text>
              <div className="pb-1" />
              <Text size={13} color="$neutral-50">
                Please stand by!
              </Text>
            </div>
          </Body>
        )}
        {matchesLG === false && <NotAllowed />}
      </>
    </QueryClientProvider>
  )
}
