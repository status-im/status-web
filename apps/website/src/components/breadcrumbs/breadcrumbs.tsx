import { Text } from '@status-im/components'
import { ChevronRightIcon } from '@status-im/icons'
import { useRouter } from 'next/router'

import { Link } from '../link'
import { formatSegment } from './format-segment'

type Props = {
  cutFirstSegment?: boolean
}

const Breadcrumbs = (props: Props) => {
  const { cutFirstSegment = true } = props

  const router = useRouter()
  const { asPath } = router
  console.log('Breadcrumbs > asPath:', asPath)

  // Splits the current path into segments
  const segments = asPath.split('/').filter(segment => segment !== '')

  return (
    <div className="border-neutral-10 flex h-[50px] items-center space-x-1 border-b px-5">
      {segments.map((segment, index) => {
        // Builds the path up to the current segment
        const path = `/${segments.slice(0, index + 1).join('/')}`

        // Determines if the current segment is the last one
        const isLastSegment = index === segments.length - 1

        // If the first segment should be cut, skip it
        if (cutFirstSegment && index === 0) {
          return null
        }

        return (
          <div className="flex flex-row items-center" key={segment}>
            {/* Always render the first chevron unless cutFirstSegment is true and we need to avoid render the chevron before  */}
            {!cutFirstSegment || (cutFirstSegment && index > 1) ? (
              <ChevronRightIcon size={20} color="$neutral-40" />
            ) : null}

            {isLastSegment ? (
              <Text size={15} color="$neutral-50" weight="medium">
                {formatSegment(segment)}
              </Text>
            ) : (
              <Link href={path}>
                <Text size={15} weight="medium">
                  {formatSegment(segment)}
                </Text>
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { Breadcrumbs }
