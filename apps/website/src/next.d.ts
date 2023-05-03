import type { NextPage } from 'next'

declare module 'next' {
  export type PageLayout = (page: React.ReactElement) => React.ReactNode

  export type Page<P = object, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
  }
}
