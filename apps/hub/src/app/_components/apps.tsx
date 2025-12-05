import { ButtonLink } from '@status-im/status-network/components'

import { apps } from '~/data/apps'

import { AppCard } from './app-card'

const Apps = () => {
  return (
    <section className="rounded-32 bg-neutral-2.5 lg:p-8">
      <div className="mb-6 flex items-start justify-between">
        <div className="max-w-2xl">
          <h3 className="mb-2 text-19 font-600 text-neutral-90 lg:text-27">
            Explore apps
          </h3>

          <p className="ml-1 text-13 text-neutral-60 lg:text-15">
            Explore curated Apps and services built on Status Network
          </p>
        </div>
        <ButtonLink
          href="/discover"
          variant="outline"
          className="!h-10 bg-white-100 px-[12px]"
        >
          Explore all apps
        </ButtonLink>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map(app => (
          <AppCard key={app.id} {...app} />
        ))}
      </div>
    </section>
  )
}

export { Apps }
