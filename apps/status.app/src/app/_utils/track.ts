import { track as vercelTrack } from '@vercel/analytics'

type TrackingData = Record<string, string | number | boolean | null>

export function trackEvent(eventName: string, data?: TrackingData) {
  vercelTrack(eventName, data)

  if (typeof window !== 'undefined' && 'umami' in window && window.umami) {
    window.umami.track(eventName, data)
  }
}
