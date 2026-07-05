import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

// Locale routes provide <html>/<body> in `[locale]/layout.tsx`.
export default function RootLayout({ children }: Props) {
  return children
}
