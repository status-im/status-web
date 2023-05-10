import { Button, Text } from '@status-im/components'
import { DownloadIcon } from '@status-im/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Logo } from '@/components/logo'
import { PageFooter } from '@/components/page-footer'
import { LINKS } from '@/config/links'

import type { PageLayout } from 'next'

export const AppLayout: PageLayout = page => {
  return (
    <div className="min-h-full bg-neutral-100">
      <div className="flex items-center px-6 py-3">
        <div className="mr-3">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-1 gap-5">
          {Object.keys(LINKS).map(title => (
            <Text key={title} size={15} weight="medium" color="$white-100">
              {title}
            </Text>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            size={32}
            variant="darkGrey"
            icon={<DownloadIcon size={20} />}
          >
            Sign up for early access
          </Button>
        </div>
      </div>

      {/* <div className="bg-white-100 mx-1 min-h-[900px] rounded-3xl">{page}</div> */}
      {page}

      <PageFooter />
    </div>
  )
}
