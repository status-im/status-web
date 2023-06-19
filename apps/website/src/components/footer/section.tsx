import { Text } from '@status-im/components'

import { Link } from '../link'

import type { Links } from '@/config/links'

type Props = {
  title: string
  links: Links
  noBorderLeft?: boolean
  hasBorderTop?: boolean
}

const Section = (props: Props) => {
  const { title, links, noBorderLeft, hasBorderTop } = props
  const hasBorderTopClassnames = hasBorderTop ? 'border-t' : 'border-t-0'

  return (
    <div>
      <div
        className={`border-neutral-80 relative grid gap-3 ${hasBorderTopClassnames} border-dashed px-5 pb-6 pt-6 lg:border-l lg:pb-0 ${
          noBorderLeft ? 'border-l-0' : 'border-l'
        }`}
      >
        <div
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(9 16 28 / 100%))',
          }}
          className=" absolute left-[-4px] top-0 h-full w-2"
        />
        <Text size={13} color="$neutral-50">
          {title}
        </Text>
        <ul className="grid gap-1">
          {links.map(link => (
            <li key={link.name}>
              <Link href={link.href}>
                <Text size={15} color="$white-100" weight="medium">
                  {link.name}
                </Text>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { Section }
