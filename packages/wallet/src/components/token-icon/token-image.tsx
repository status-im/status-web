'use client'

import { useState } from 'react'

import type { ReactNode } from 'react'

// This is the same UNI image used by the Base/Celo entries in our token list.
// Resolve by content ID, not symbol: unrelated tokens can also be named UNI.
const UNI_ICON = 'ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg'

function resolveIconUrl(icon?: string): string | undefined {
  if (icon === UNI_ICON) {
    return 'https://ethereum-optimism.github.io/data/UNI/logo.png'
  }
  if (icon?.startsWith('ipfs://')) {
    return `https://ipfs.io/ipfs/${icon.slice('ipfs://'.length)}`
  }
  return icon || undefined
}

type Props = {
  src?: string
  alt: string
  className: string
  fallback: ReactNode
}

function ImageWithFallback({ src, alt, className, fallback }: Props) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) return <>{fallback}</>

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}

export function TokenImage(props: Props) {
  const src = resolveIconUrl(props.src)

  // Retry each incoming URL change, even if it resolves to the same image URL.
  return <ImageWithFallback key={props.src} {...props} src={src} />
}
