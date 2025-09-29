import { Text } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/16'

import { Link } from '~components/link'

import type { Routes } from '~/config/routes'

type Props = {
  title: string
  routes: Routes
}

const Section = (props: Props) => {
  const { title, routes } = props

  return (
    <div className="relative">
      <div
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(9 16 28 / 100%))',
        }}
        className="absolute left-[-2px] top-0 z-10 h-full w-1"
      />
      <div className="relative grid gap-3 border-t border-dashed border-neutral-80 py-6 pl-5">
        <Text size={13} color="$neutral-50">
          {title}
        </Text>
        <ul className="grid gap-1">
          {routes.map(route => {
            const external = route.href.startsWith('http')

            return (
              <li key={route.name}>
                <Link href={route.href} className="group flex items-center">
                  <span className="text-15 font-medium text-white-100 transition-colors group-data-[active='true']:text-neutral-40 group-hover:text-neutral-50">
                    {route.name}
                  </span>
                  {external && (
                    <ExternalIcon className="-mb-0.5 text-neutral-40 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export { Section }
