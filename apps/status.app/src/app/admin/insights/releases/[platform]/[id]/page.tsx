// import { MDXRemote } from 'next-mdx-remote/rsc'

// import { adminComponents } from '~components/content'
import { AdminLayoutDetailView } from '~admin/_layouts/admin-layout-detail-view'
import { api } from '~server/trpc/server'

import { ReleaseDetail } from './_components/release-detail'

import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const release = await api.releases.byId({ id: Number((await params).id) })

  return {
    title: release.title,
  }
}

type Props = {
  params: Promise<{
    id: string
    platform: string
  }>
}

export default async function ReleasePage({ params }: Props) {
  const { id: releaseId } = await params

  const [release, projects, user] = await Promise.all([
    api.releases.byId({ id: Number(releaseId) }),
    api.projects.all(),
    api.user(),
  ])

  const breadcrumbs = [
    {
      label: 'Releases',
      href: '/admin/insights/releases',
    },
    {
      label: release.title,
      href: `/admin/insights/releases/${releaseId}`,
    },
  ]

  return (
    <AdminLayoutDetailView title={release.title} breadcrumbs={breadcrumbs}>
      <ReleaseDetail release={release} projects={projects} user={user} />
      {/* commented out because there is no release with content */}
      {/* <AdminLayoutDetailView.Separator /> */}
      {/* <MDXRemote
        source={release.description || ''}
        components={adminComponents}
      /> */}
    </AdminLayoutDetailView>
  )
}
