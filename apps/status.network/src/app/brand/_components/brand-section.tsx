import { DownloadIcon } from '@status-im/icons/20'
import { DownloadZipButton } from './download-zip-button'

type Props = {
  title: string
  description: string
  children: React.ReactNode
  fileName?: string
}

const BrandSection = (props: Props) => {
  const { title, description, children, fileName } = props

  return (
    <section className="relative z-20 py-10">
      <div className="flex flex-col gap-5 pb-10 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div className="grid gap-1">
          <h2 className="text-27 font-600">{title}</h2>
          <p className="text-27">{description}</p>
        </div>

        {fileName && (
          <DownloadZipButton
            variant="white"
            iconBefore={<DownloadIcon className="text-neutral-50" />}
            fileName={fileName}
            className="w-full justify-center lg:w-fit lg:justify-start"
          >
            Download
          </DownloadZipButton>
        )}
      </div>

      <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    </section>
  )
}

export { BrandSection }
export type { Props as BrandSectionProps }
