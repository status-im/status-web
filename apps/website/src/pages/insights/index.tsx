import { useEffect } from 'react'

import { useRouter } from 'next/router'

export default function InsightsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the epics page if the user lands on the insights page
    if (router.pathname === '/insights') {
      router.replace('/insights/epics')
    }
  }, [router])

  return null
}
