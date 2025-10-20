import config from '~/config/help/config.json'
import { slugify } from '~app/_utils/slugify'
import { Body } from '~components/body'
import { SidebarMenu } from '~website/_components/sidebar-menu'

type Props = {
  children: React.ReactNode
}

function transformArray(arr: any[]): any {
  return arr.map(item => {
    const [label, value] = Object.entries(item)[0]
    if (Array.isArray(value)) {
      return {
        label,
        href: '/help' + Object.values(value[0])[0],
        links: value.map(link => {
          const [linkLabel, linkValue] = Object.entries(link)[0] as [any, any]

          return {
            label: linkLabel,
            href: '/help' + linkValue + '#' + slugify(linkLabel),
          }
        }),
      }
    }

    return {
      label,
      href: value,
    }
  })
}

export default function HelpLayout({ children }: Props) {
  return (
    <Body className="relative">
      <div className="absolute bottom-0 left-0 top-12 border-r border-neutral-10">
        <div className="sticky top-0 hidden lg:block">
          <SidebarMenu items={transformArray(config.nav)} />
        </div>
      </div>

      {children}
    </Body>
  )
}
