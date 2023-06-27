import { Text } from '@felicio/components'
import { cva } from 'class-variance-authority'

import { Link } from '../link'

import type { Links } from '@/config/links'

type Props = {
  title: string
  links: Links
  hasBorderLeft?: boolean
  hasBorderTop?: boolean
}

const section = cva(
  [
    'border-neutral-80',
    'relative',
    'grid',
    'gap-3',
    'border-dashed',
    'px-5',
    'pb-6',
    'pt-6',
    'lg:border-l',
    'lg:pb-0',
  ],
  {
    variants: {
      hasBorderTop: {
        true: ['border-t'],
        false: ['border-t-0'],
      },
      hasBorderLeft: {
        true: ['border-l'],
        false: ['border-l-0'],
      },
    },
  }
)

const Section = (props: Props) => {
  const { title, links, hasBorderLeft, hasBorderTop } = props

  return (
    <div>
      <div
        className={section({
          hasBorderTop,
          hasBorderLeft,
        })}
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
