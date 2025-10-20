import { Button } from '@status-im/components'
import { ArrowRightIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { Image } from '~components/assets'

type Props = {
  children?: React.ReactNode
  afterDownload?: boolean
}

const DownloadConnectorSection = (props: Props) => {
  const { children, afterDownload } = props

  return (
    <div
      className={cx(
        'flex flex-col-reverse items-start gap-2 overflow-hidden bg-white-100 pt-8 shadow-2 lg:flex-row lg:items-stretch xl:gap-12',
        afterDownload ? 'rounded-20' : 'rounded-[32px]'
      )}
    >
      <div
        className={cx(
          'relative flex w-full items-end self-end lg:aspect-[551/474] lg:bg-neutral-5 xl:h-[474px] xl:max-w-[551px] xl:items-start',
          afterDownload ? 'xl:min-h-[506px]' : 'xl:h-[474px]'
        )}
      >
        <Image
          id="Platforms/Screens/Extension Screens/Connector_02:1102:1012"
          alt=""
          width={551}
          height={506}
        />
      </div>
      <div className="flex w-full max-w-[450px] flex-col lg:max-w-[542px] lg:justify-between xl:max-w-[592px]">
        <div className="p-4 xl:pl-6 xl:pr-12 2xl:pl-12">{children}</div>
        <div className="px-4 pb-6 lg:pb-12 xl:pl-6 2xl:pl-12">
          <p className="pb-3 text-19">Want to learn how it works?</p>
          <Button
            href="/help/wallet/install-the-status-connector-extension"
            iconAfter={<ArrowRightIcon />}
            variant="outline"
            size="32"
          >
            Check out our docs
          </Button>
        </div>
      </div>
    </div>
  )
}

export { DownloadConnectorSection }
