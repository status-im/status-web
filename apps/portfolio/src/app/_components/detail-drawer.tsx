'use client'

import { useCallback, useEffect, useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { match, P } from 'ts-pattern'

import { useMediaQuery } from '../_hooks/use-media-query'
import * as Drawer from './drawer'

type Props = {
  children: React.ReactNode
}

const DetailDrawer = (props: Props) => {
  const { children } = props
  const [open, setOpen] = useState(false)
  const is2Xl = useMediaQuery('2xl')
  const is2Md = useMediaQuery('2md')

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const isDetailView = useCallback(() => {
    return match<string, boolean>(pathname)
      .with(
        P.when(p => p.endsWith('/assets') || p.endsWith('/collectibles')),
        () => false
      )
      .with(
        P.when(p => {
          const segments = p.split('/').filter(Boolean)
          return p.includes('/assets/') && segments.length === 3
        }),
        () => true
      )
      .with(
        P.when(p => {
          const segments = p.split('/').filter(Boolean)
          return p.includes('/collectibles/') && segments.length >= 5
        }),
        () => true
      )

      .otherwise(() => false)
  }, [pathname])

  useEffect(() => {
    if (is2Xl) {
      return setOpen(false)
    }

    setOpen(isDetailView())
  }, [isDetailView, is2Xl])

  if (is2Xl || !is2Md) {
    return null
  }

  const handleModal = (value: boolean) => {
    setOpen(value)
    if (!value && isDetailView()) {
      const basePath =
        pathname.match(/(.*?\/(?:assets|collectibles))/)?.[0] || '/'
      // Append query parameters if any exist
      const queryString = searchParams.toString()
      const targetPath = queryString ? `${basePath}?${queryString}` : basePath
      router.push(targetPath, { scroll: false })
    }
  }

  return (
    <Drawer.Root modal open={open} onOpenChange={handleModal}>
      <Drawer.Content className="!right-3 !top-16 !h-[calc(100vh-74px)] !gap-0 !overflow-clip !p-0">
        <Drawer.Header>
          <Drawer.Title className="hidden">Detail view</Drawer.Title>
        </Drawer.Header>
        <div className="flex min-h-full flex-col">{children}</div>
      </Drawer.Content>
    </Drawer.Root>
  )
}

export { DetailDrawer }
