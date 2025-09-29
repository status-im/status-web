import { Text } from '@status-im/components'

import { Link } from '~components/link'

type Props = {
  headings: Array<{ level: 1 | 2; value: string; slug: string }>
}

export const TOC = (props: Props) => {
  const { headings } = props

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      <Text size={13} weight="medium" color="$neutral-50">
        On this page
      </Text>
      <div className="flex flex-col gap-2">
        {headings.map((heading, index) => (
          <Link key={heading.value + index} href={{ hash: heading.slug }}>
            <Text size={15} weight="medium">
              {heading.value}
            </Text>
          </Link>
        ))}
      </div>
    </div>
  )
}
