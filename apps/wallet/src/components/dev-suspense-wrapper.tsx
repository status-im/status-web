import { use } from 'react'

type Props = {
  children: React.ReactNode
  delayMs?: number
}

export function DevSuspenseWrapper({ children, delayMs = 3000 }: Props) {
  // Only delay in development
  // eslint-disable-next-line no-restricted-globals
  if (process.env.NODE_ENV === 'development') {
    // Create a promise that resolves after the delay
    const promise = new Promise(resolve => setTimeout(resolve, delayMs))
    // This will suspend until the promise resolves
    use(promise)
  }

  return <>{children}</>
}
