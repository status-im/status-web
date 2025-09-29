import { Card } from '~admin/_components/card'
import { api } from '~server/trpc/server'

import { EXTERNAL_ROUTES, INTERNAL_ROUTES } from './_constants'

export default async function OverviewPage() {
  const user = await api.user()

  return (
    <main className="grow p-6 md:overflow-y-auto md:p-12">
      {/* <h1 className="pb-1 text-27 font-semibold">Hello, {user.name}!</h1> */}
      <h1 className="pb-1 text-27 font-semibold">Hello, {user.email}!</h1>
      <p className="text-13 md:text-15">
        Welcome to Status management powerhouse - your control center.
      </p>
      <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5">
        {INTERNAL_ROUTES.map(route => {
          if (
            (route.href.startsWith('/admin/insights') &&
              !(user.canEditInsights || user.canViewInsights)) ||
            (route.href.startsWith('/admin/keycard') &&
              !(user.canEditKeycard || user.canViewKeycard)) ||
            (route.href.startsWith('/admin/reporting') && !user.canEditReports)
          ) {
            return null
          }

          return <Card key={route.title} {...route} />
        })}
      </div>
      <section className="py-6">
        <p className="pb-1 text-15 font-600 md:text-19">External platforms</p>
        <p className="text-13 md:text-15">
          Manage Shopify, blog, forum, translations, and upvote via external
          platforms.
        </p>
        <div className="grid grid-cols-1 gap-4 pb-6 pt-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5">
          {EXTERNAL_ROUTES.map(route => (
            <Card key={route.title} {...route} />
          ))}
        </div>
      </section>
    </main>
  )
}
