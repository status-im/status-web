'use client' // error boundaries must be Client Components

import { useEffect } from 'react'

import { notFound } from 'next/navigation'

import { NavDesktop } from '~website/_components/navigation/nav-desktop'
import { NavMobile } from '~website/_components/navigation/nav-mobile'
import { NotFoundContent } from '~website/_components/not-found-content'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

function isNotFoundDigest(digest: string | undefined): boolean {
  if (!digest) return false
  // Next.js marks not-found errors with one of these digests depending on version.
  return (
    digest === 'NEXT_NOT_FOUND' ||
    digest.startsWith('NEXT_HTTP_ERROR_FALLBACK;')
  )
}

export default function Error({ error }: Props) {
  // Forward Next.js's internal not-found errors to not-found.tsx so the
  // response is served with HTTP 404 instead of 500.
  if (isNotFoundDigest(error.digest)) {
    notFound()
  }

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
