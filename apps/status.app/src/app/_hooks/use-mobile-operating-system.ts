import { useEffect, useState } from 'react'

export const useMobileOperatingSystem = () => {
  const [mobileOS, setMobileOS] = useState<'ios' | 'android' | null>(null)

  useEffect(() => {
    const userAgent = navigator.userAgent

    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return setMobileOS('ios')
    }

    if (/android/i.test(userAgent)) {
      return setMobileOS('android')
    }

    setMobileOS(null)
  }, [])

  return mobileOS
}
