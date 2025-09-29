import { ToastContainer } from '@status-im/components'

import { NotAllowed } from '~admin/_components/not-allowed'
import { api } from '~server/trpc/server'

import { Content } from './_components/content'
import { LayoutProvider } from './_contexts/layout-context'
import { UserProvider } from './_contexts/user-context'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Status Admin',
    default: 'Status Admin',
  },
}

type Props = {
  children: React.ReactNode
}

export default async function AdminLayout(props: Props) {
  const { children } = props

  const user = await api.user()

  return (
    <UserProvider user={user}>
      <LayoutProvider>
        <NotAllowed />
        <Content>{children}</Content>
        <ToastContainer />
      </LayoutProvider>
    </UserProvider>
  )
}
