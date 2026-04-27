'use client'

import { useEffect } from 'react'

import { useRouter } from '~/i18n/navigation'

export default function StakePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/')
  }, [router])

  return null
}
