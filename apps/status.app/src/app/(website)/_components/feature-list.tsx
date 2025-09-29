import { Text } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { Image } from '~components/assets'
import { Link } from '~components/link'

import type { ImageId } from '~components/assets'

type Item = {
  title: string
  description: string
  icon: ImageId
  link?: {
    label: string
    href: string
  }
}

type Props = {
  list: Item[]
  dark?: boolean
}

const FeatureList = (props: Props) => {
  const { list, dark = false } = props

  return (
    <div className="container relative z-10 xl:m-auto xl:gap-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:-ml-10 xl:grid-cols-3">
        {list.map(({ title, icon, description, link }, i) => (
          <div key={title} className="flex flex-col">
            <Image
              id={icon}
              alt=""
              className="mb-4 size-12 xl:ml-10"
              width={48}
              height={48}
            />
            <div
              className={cx(
                'flex flex-col gap-1 border-dashed xl:pl-10',
                i % 3 === 0 ? 'xl:border-l-0' : 'xl:border-l',
                dark ? 'border-l-neutral-70' : 'border-l-neutral-30'
              )}
            >
              <Text
                size={27}
                weight="semibold"
                color={dark ? '$white-100' : undefined}
              >
                {title}
              </Text>
              <Text size={19} color={dark ? '$white-80' : undefined}>
                {description}
              </Text>
              {link && (
                <Link
                  href={link.href}
                  className="group mt-3 flex items-center gap-1"
                >
                  <Text
                    size={19}
                    color={dark ? '$white-80' : undefined}
                    weight="medium"
                  >
                    {link.label}
                  </Text>

                  <ExternalIcon className="transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[-2px]" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { FeatureList }
export type { Props as FeatureListProps }
