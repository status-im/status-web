import { customisation, neutral, white } from '@status-im/colors'
import { JSONLDScript, Text } from '@status-im/components'
import { DownloadIcon } from '@status-im/icons/20'
import { getTranslations } from 'next-intl/server'

import { jsonLD } from '~/utils/json-ld'
import { Metadata } from '~app/_metadata'
import { rgbToHex } from '~app/_utils/rgb-to-hex'
import { Body } from '~components/body'
import { ParallaxCircle } from '~website/_components/parallax-circle'

import { HeroSection } from '../_components/hero-section'
import {
  AssetSection,
  ColorSection,
  LogoSection,
} from './_components/brand-sections'
import { DownloadZipButton } from './_components/download-zip-button'

import type { ImageAlt } from '~components/assets'
import type { Metadata as NextMetadata } from 'next'

function transformColor(name: string, rgba: string, invert = false) {
  const [r, g, b] = rgba.match(/\d+/g)!.map(Number)
  return {
    name,
    rgb: { r, g, b },
    hex: rgbToHex({ r, g, b }),
    invert,
  }
}

export async function generateMetadata(): Promise<NextMetadata> {
  const t = await getTranslations('brand')

  return Metadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: '/brand',
    },
  })
}

export default async function BrandPage() {
  const t = await getTranslations('brand')
  const tn = await getTranslations('nav')

  const organizationSchema = jsonLD.organization({
    description: t('metaDescription'),
  })

  return (
    <>
      <JSONLDScript schema={organizationSchema} />
      <Body className="relative">
        <ParallaxCircle
          color="purple"
          className="left-[-338px] top-[-338px] xl:left-[-270px] xl:top-[-56px]"
        />
        <ParallaxCircle
          color="sky"
          className="left-[-382px] top-[192px] xl:left-[240px] xl:top-[-454px]"
        />
        <ParallaxCircle
          color="orange"
          className="left-[82px] top-[136px] xl:left-[250px] xl:top-[178px]"
        />
        <ParallaxCircle
          color="yellow"
          className="left-[49px] right-auto top-[1300px] xl:left-auto xl:right-[100px] xl:top-[560px]"
        />
        <HeroSection
          tag={tn('brand')}
          title={t('heroTitle')}
          className="relative z-20 pb-12 xl:pb-30"
          action={
            <div className="flex w-full flex-col gap-3 rounded-16 border border-dashed border-neutral-80/20 bg-white-20 p-2 pl-3 sm:max-w-[462px] sm:flex-row sm:items-center sm:gap-10">
              <Text size={13}>{t('heroDescription')}</Text>

              <DownloadZipButton
                iconBefore={<DownloadIcon />}
                zipFileId="Brand/brand-assets.zip"
              >
                {t('download')}
              </DownloadZipButton>
            </div>
          }
        />

        <div className="relative border-b border-dashed border-neutral-80/20 pb-12 xl:pb-20">
          <LogoSection
            title={t('ourLogo')}
            description={t('withTypo')}
            assetName="Brand/logo-assets.zip"
            downloadLabel={t('download')}
            downloadAriaLabel={t('downloadImage')}
            logos={[
              {
                id: 'Brand/Logo Section/Logo/Logo_01:1640:480',
                alt: '',
              },
              {
                id: 'Brand/Logo Section/Logo/Logo_02:1640:480',
                alt: '',
              },
              {
                id: 'Brand/Logo Section/Logo/Logo_03:1640:480',
                alt: '',
              },
              {
                id: 'Brand/Logo Section/Logo/Logo_04:1640:480',
                alt: '',
                gradient: true,
              },
            ]}
          />
          <LogoSection
            title={t('markOnly')}
            description={t('withoutTypo')}
            assetName="Brand/mark-assets.zip"
            downloadLabel={t('download')}
            downloadAriaLabel={t('downloadImage')}
            logos={[
              {
                id: 'Brand/Logo Section/Mark/Mark_01:480:480',
                alt: '',
              },
              { id: 'Brand/Logo Section/Mark/Mark_02:480:480', alt: '' },
              { id: 'Brand/Logo Section/Mark/Mark_03:480:480', alt: '' },
              {
                id: 'Brand/Logo Section/Mark/Mark_04:480:480',
                alt: '',
                gradient: true,
              },
            ]}
          />
          <LogoSection
            title={t('otherVariants')}
            description={t('withAndWithoutTypo')}
            assetName="Brand/variant-assets.zip"
            downloadLabel={t('download')}
            downloadAriaLabel={t('downloadImage')}
            logos={[
              {
                id: 'Brand/Logo Section/Variants/Logo/Logo_01:1640:480',
                alt: '',
              },
              {
                id: 'Brand/Logo Section/Variants/Mark/Mark_01:480:480',
                alt: '',
              },
              {
                id: 'Brand/Logo Section/Variants/Logo/Logo_02:1640:480',
                alt: '',
              },
              {
                id: 'Brand/Logo Section/Variants/Mark/Mark_02:480:480',
                alt: '',
              },
              {
                id: 'Brand/Logo Section/Variants/Logo/Logo_03:1640:480',
                alt: '',
              },
              {
                id: 'Brand/Logo Section/Variants/Mark/Mark_03:480:480',
                alt: '',
              },
            ]}
          />
          <ParallaxCircle
            color="blue"
            className="bottom-[-317px] left-[-311px] xl:bottom-[-48px] xl:left-[358px]"
          />
        </div>

        <div className="relative border-b border-dashed border-neutral-80/20 bg-white-100 py-12 xl:py-20">
          <ColorSection
            title={t('mainColors')}
            description={t('mainColorsPalette')}
            colors={[
              transformColor(t('dark'), neutral['100']),
              transformColor(t('white'), white['100'], true),
              transformColor(t('blue'), customisation.blue['50']),
            ]}
          />
          <ColorSection
            title={t('customColors')}
            description={t('accentColors')}
            colors={[
              transformColor(t('purple'), customisation.purple['50']),
              transformColor(t('orange'), customisation.orange['50']),
              transformColor(t('army'), customisation.army['50']),
              transformColor(t('turquoise'), customisation.turquoise['50']),
              transformColor(t('sky'), customisation.sky['50']),
              transformColor(t('yellow'), customisation.yellow['50']),
              transformColor(t('pink'), customisation.pink['50']),
              transformColor(t('copper'), customisation.copper['50']),
              transformColor(t('camel'), customisation.camel['50']),
              transformColor(t('magenta'), customisation.magenta['50']),
            ]}
          />
          <ParallaxCircle
            color="purple"
            className="left-[-250px] top-[538px] xl:top-[257px]"
          />
          <ParallaxCircle
            color="pink"
            className="bottom-[-240px] right-[-46px] xl:bottom-[-270px] xl:right-[48px]"
          />
        </div>

        <div className="relative border-b border-dashed border-neutral-80/20 bg-white-100 py-12 xl:py-20">
          <AssetSection
            title={t('productAssets')}
            description={t('productScreenshots')}
            assetName="Brand/product-assets.zip"
            assets={[
              {
                id: 'Brand/Product Assets/Other/Asset_Other_04:750:1624',
                alt: t(
                  'profileAssetsAlt'
                ) as ImageAlt['Brand/Product Assets/Other/Asset_Other_04:750:1624'],
              },
              {
                id: 'Brand/Product Assets/Communities/Asset_Communities_02:750:1624',
                alt: t(
                  'communityAssetsAlt'
                ) as ImageAlt['Brand/Product Assets/Communities/Asset_Communities_02:750:1624'],
              },
              {
                id: 'Brand/Product Assets/Wallet/Asset_Wallet_05:750:1624',
                alt: t(
                  'walletAssetsAlt'
                ) as ImageAlt['Brand/Product Assets/Wallet/Asset_Wallet_05:750:1624'],
              },
            ]}
          />
          <div className="absolute left-1/2 top-0 size-full -translate-x-1/2 bg-gradient-to-t from-customisation-blue-50/5 to-transparent" />
        </div>

        <div className="container py-24 xl:py-40">
          <div className="mx-auto flex max-w-[606px] flex-col items-center">
            <h3 className="mb-4 text-center text-40 font-bold xl:text-64">
              {t('downloadAssets')}
            </h3>
            <div className="mb-8 max-w-[484px] text-center">
              <Text size={27}>{t('downloadAssetsDescription')}</Text>
            </div>
            <DownloadZipButton
              iconBefore={<DownloadIcon />}
              zipFileId="Brand/brand-assets.zip"
            >
              {t('download')}
            </DownloadZipButton>
          </div>
        </div>
      </Body>
    </>
  )
}
