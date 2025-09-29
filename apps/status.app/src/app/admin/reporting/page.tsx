import { redirect } from 'next/navigation'

import { api } from '~server/trpc/server'

export default async function ReportingPage() {
  const user = await api.user()

  redirect(`/admin/reporting/${user.contributorId}`)
}
