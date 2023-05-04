import { Button, Text } from '@status-im/components'
import { DownloadIcon, PlayIcon } from '@status-im/icons'

import { PageFooter } from '@/components/page-footer'
import { AppLayout } from '@/layouts/app-layout'

import type { Page } from 'next'

const HomePage: Page = () => {
  return (
    <>
      <div className="bg-white-100 mx-1 rounded-3xl py-32">
        <div className="mx-40 mb-40 grid gap-8">
          <div className="grid gap-6">
            <h1 className="text-7xl font-bold">
              Make the
              <br />
              jump to web3
            </h1>

            <Text size={19}>
              An open source, decentralized communication super app
            </Text>
          </div>

          <div className="grid gap-4">
            <div className="flex gap-3">
              <Button size={40} icon={<DownloadIcon size={20} />}>
                Get Status
              </Button>
              <Button size={40} variant="outline" icon={<PlayIcon size={20} />}>
                Watch Video
              </Button>
            </div>
            <Text size={11} color="$neutral-50">
              Avaliable for Mac, Windows, Linux, iOS & Android
            </Text>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-white-100 text-4xl">
          Own a community? Time to take back control!
        </h2>
        <Text size={19} color="$white-100">
          {"Don't give Discord and Telegram power over your community."}
        </Text>
      </div>

      <div className="bg-white-100 mx-1 rounded-3xl py-32">section 2</div>

      <PageFooter />
    </>
  )
}

HomePage.getLayout = AppLayout

export default HomePage
