'use client' // error boundaries must be Client Components

import { useEffect } from 'react'

import { NavDesktop } from '~website/_components/navigation/nav-desktop'
import { NavMobile } from '~website/_components/navigation/nav-mobile'
import { NotFoundContent } from '~website/_components/not-found-content'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error }: Props) {
  useEffect(() => {
    console.error('[ROOT ERROR BOUNDARY]', error)
  }, [error])

  return (
    <>
      {/* simulate the WebsiteLayout without the server side fetching */}
      <NavDesktop />
      <NavMobile />
      <div className="flex flex-1 flex-col overflow-x-clip xl:px-1 xl:pb-1">
        <NotFoundContent />
      </div>
    </>
  )
}
