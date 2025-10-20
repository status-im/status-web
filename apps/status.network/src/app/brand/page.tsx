import { customisation, neutral, white } from '@status-im/colors'
import { DownloadIcon } from '@status-im/icons/20'
import { Divider } from '~app/_components/divider'
import { Metadata } from '~app/_metadata'
import { transformColor } from '~app/_utils/colors'
import Image from 'next/image'
import { ColorSection } from './_components/color-section'
import { DownloadZipButton } from './_components/download-zip-button'
import { LogoSection } from './_components/logo-section'

export const metadata = Metadata({
  title: 'Brand',
  description: 'Get Status Network brand assets.',
})

export default function BrandPage() {
  return (
    <>
      <div className="flex flex-col gap-3 px-4 pb-10 pt-24 lg:p-[120px]">
        <h1 className="text-40 font-700 lg:text-64">Brand assets</h1>
        <p className="mb-5 text-19 font-400 text-neutral-50">
          Last updated: 10 February 2025
        </p>
        <DownloadZipButton
          iconBefore={<DownloadIcon />}
          fileName="brand-assets.zip"
        >
          Download all assets
        </DownloadZipButton>
      </div>

      <div className="relative px-4 pb-10 lg:px-[120px] lg:pb-[77px] lg:pt-10">
        <LogoSection
          title="Logo"
          description="Our main logo"
          fileName="logo.zip"
          logos={[
            {
              src: '/brand/main/logo-01.png',
              height: 96,
              width: 631,
              className: 'max-w-[315px]',
              alt: 'Main logo',
            },
            {
              src: '/brand/main/logo-02.png',
              height: 96,
              width: 631,
              className: 'max-w-[315px]',
              alt: 'Main logo',
            },
            {
              src: '/brand/main/logo-03.png',
              height: 96,
              width: 631,
              className: 'max-w-[315px]',
              alt: 'Main logo',
              gradient: true,
            },
          ]}
        />
        <LogoSection
          title="Logo variation"
          description="For creative printing layouts"
          fileName="logo-variation.zip"
          logos={[
            {
              src: '/brand/variation/logo-01.png',
              height: 96,
              width: 318,
              className: 'max-w-[159px]',
              alt: 'Mark only',
            },
            {
              src: '/brand/variation/logo-02.png',
              height: 96,
              width: 318,
              className: 'max-w-[159px]',
              alt: 'Mark only',
            },
            {
              src: '/brand/variation/logo-03.png',
              height: 96,
              width: 318,
              className: 'max-w-[159px]',
              alt: 'Mark only',
              gradient: true,
            },
          ]}
        />
        <LogoSection
          title="Mark only"
          description="With wordmark"
          fileName="mark.zip"
          logos={[
            {
              src: '/brand/mark/logo-01.png',
              height: 96,
              width: 97,
              className: 'max-w-[48px]',
              alt: 'Mark only',
            },
            {
              src: '/brand/mark/logo-02.png',
              height: 96,
              width: 97,
              className: 'max-w-[48px]',
              alt: 'Mark only',
            },
            {
              src: '/brand/mark/logo-03.png',
              height: 96,
              width: 97,
              className: 'max-w-[48px]',
              alt: 'Mark only',
              gradient: true,
            },
          ]}
        />
      </div>
      <Divider variant="fullscreen" />

      <div className="relative bg-[#1B273D05] px-4 py-10 lg:px-[120px] lg:py-[118px]">
        <ColorSection
          title="Main colors"
          description="Our main colors palette"
          colors={[
            transformColor('Purple', customisation.purple['50']),
            transformColor('Dark', neutral['100']),
            transformColor('White', white['100'], true),
          ]}
        />
      </div>
      <Divider variant="fullscreen" />

      <div className="relative px-4 py-20 lg:px-[120px] lg:pt-10">
        <div className="flex flex-col gap-5 pb-12 md:flex-row md:items-center md:justify-between md:gap-0 md:pb-10">
          <div className="grid gap-1">
            <h2 className="text-27 font-600">Artwork</h2>
            <p className="text-27">Our main characters</p>
          </div>

          <DownloadZipButton
            variant="white"
            iconBefore={<DownloadIcon className="text-neutral-50" />}
            fileName="artwork.zip"
            className="w-full justify-center lg:w-fit lg:justify-start"
          >
            Download
          </DownloadZipButton>
        </div>

        <div className="w-full overflow-hidden rounded-20">
          <Image
            src="/brand/artwork.png"
            alt="Artwork"
            width={1192}
            height={476}
            className="scale-110"
          />
        </div>
      </div>
    </>
  )
}
