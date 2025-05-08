import { Slider } from '@status-im/wallet/components'

import { AddressSection } from './_components/address-section'
import { ConnectButton } from './_components/connect-button'
import { FeatureEnabled } from './_components/feature-enabled'

import type { SliderProps } from '@status-im/wallet/components'

// import { OnboardingFooter } from './_components/onboarding-footer'

// import { getLegalDocumentContent } from './_utils/get-legal-document-content'

const items: SliderProps['items'] = [
  {
    title: 'Unite Your Assets',
    description:
      'No more hopping between apps to view your assets and collectibles. Everything conveniently in one place.',
    image: { id: 'Portfolio/Landing/Slider/Assets:1120:991', alt: '' },
  },
  {
    title: 'All addresses. One platform.',
    description:
      'Bring all your Ethereum addresses together to make viewing and interacting with your portfolio a breeze.',
    image: { id: 'Portfolio/Landing/Slider/Addresses:1700:1102', alt: '' },
  },
  {
    title: 'All networks - all the time',
    description:
      'See all your assets and NFTs in one place, even if spread across multiple blockchains',
    image: { id: 'Portfolio/Landing/Slider/Networks:1529:1184', alt: '' },
  },
]

export default async function OnboardingPage() {
  // const [privacyPolicy, termsOfUse] = await Promise.all([
  //   getLegalDocumentContent('legal/privacy-policy.md'),
  //   getLegalDocumentContent('legal/terms-of-use.md'),
  // ])

  return (
    <>
      <main className="grid grow grid-cols-12">
        <div className="col-span-12 p-6 lg:col-span-4 xl:p-12">
          <div className="flex h-full max-w-[425px] flex-col justify-center gap-4 pt-10 lg:pt-30 xl:pt-[187px]">
            <h1 className="text-48 font-bold 2xl:text-64">Explore Ethereum</h1>
            <p className="pb-4 text-15 md:text-19">
              Import, manage and transact with all your Ethereum addresses in
              one secure place.
            </p>
            <ConnectButton />
            <FeatureEnabled featureFlag="WATCHED_ADDRESSES">
              <div className="flex items-center gap-3">
                <span className="h-px w-full bg-neutral-30" />
                <span className="whitespace-nowrap bg-white-100 text-13 text-neutral-50">
                  or watch address
                </span>
                <span className="h-px w-full bg-neutral-30" />
              </div>
              <AddressSection />
            </FeatureEnabled>
            {/* <OnboardingFooter
              privacyContent={privacyPolicy.content}
              termsContent={termsOfUse.content}
            /> */}
          </div>
        </div>
        <div className="col-span-12 hidden p-3 md:col-span-8 lg:block">
          <Slider items={items} />
        </div>
      </main>
    </>
  )
}
