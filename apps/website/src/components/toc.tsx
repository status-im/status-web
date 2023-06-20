import { Text } from '@status-im/components'

import { Link } from './link'

import type { Doc } from '@docs'

type TOCProps = {
  headings: Doc['headings']
}

export const TOC = (props: TOCProps) => {
  const { headings } = props
  return (
    <div className="flex flex-col gap-3">
      <Text size={13} weight="medium" color="$neutral-50">
        In this article
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
