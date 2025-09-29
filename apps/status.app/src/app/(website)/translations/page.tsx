import { Text } from '@status-im/components'

import { DISCUSS_TRANSLATE_URL } from '~/config/routes'
import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { HeroSection } from '~website/_components/hero-section'
import { ParallaxCircle } from '~website/_components/parallax-circle'

import { DiscussCTA } from './_components/discuss-cta'
import { WordAnimation } from './_components/word-animation'

export const metadata = Metadata({
  title: 'Translations',
  description:
    'We need your help to translate Status, so that together we can bring privacy and free speech to the people everywhere, including those who need it most.',
})

export default function TranslationsPage() {
  return (
    <Body>
      <HeroSection
        tag="Translations"
        title="Help translate Status"
        description="We need your help to translate Status, so that together we can bring privacy and free speech to the people everywhere, including those who need it most."
        action={<DiscussCTA />}
        video={{
          id: 'Translations/Animations/Translations_Hero:721:575',
          posterId:
            'Translations/Animations/Frames/Translations_Hero_Frame:721:575',
        }}
      />
      <ParallaxCircle
        color="blue"
        className="left-[-310px] right-auto top-[-310px] xl:left-auto xl:right-6 xl:top-[-343px]"
      />
      <ParallaxCircle
        color="purple"
        className="left-[-254px] top-[236px] xl:left-[40px] xl:top-[336px]"
      />
      <ParallaxCircle
        color="sky"
        className="left-[-488px] top-[236px] xl:left-[344px] xl:top-[336px]"
      />
      <ParallaxCircle
        color="orange"
        className="right-0 top-[836px] xl:right-[444px] xl:top-[636px]"
      />
      <ParallaxCircle
        color="sky"
        className="right-[-320px] top-[836px] xl:right-[44px] xl:top-[636px]"
      />
      <ParallaxCircle
        color="blue"
        className="bottom-[262px] left-[-338px] right-auto xl:left-auto xl:right-[calc(50%+76px)]"
      />

      <section className="relative z-20 cursor-default select-none py-12 text-center xl:py-20">
        <WordAnimation />
      </section>

      <section className="container relative z-20 max-w-[742px] pb-24 pt-20 xl:pb-40">
        <h3 className="mb-3 text-27 font-semibold xl:mb-4">
          Together we can achieve an ambitious mission
        </h3>
        <p className="mb-12">
          <Text size={19}>
            The mission of protecting freedom and human rights worldwide is
            ambitious, and not something any single organisation can achieve on
            its own. But with many minds working in concert, we have a chance of
            making online free speech a global reality for all.
            <br />
            <br />
            Status seeks to grow its community of like minded individuals
            dedicated to this cause by translating content across a variety of
            languages. To do this, we need your help!
            <br />
            <br />
            Are you bilingual? Do you understand blockchain and decentralised
            technologies and can explain these concepts in easy to understand
            words in your native language? Assist with translating Status to
            help remove the language barriers that can prevent some from
            accessing the tools that help enable freedom.
          </Text>
        </p>

        <h3 className="mb-3 text-27 font-semibold xl:mb-4">
          Reach out to help
        </h3>
        <p>
          <Text size={19}>
            Reach out to us if you would like to contribute to translations. If
            you are interested in learning more about translating our content,
            please visit{' '}
            <a
              href={DISCUSS_TRANSLATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-customisation-blue-50 underline-offset-2 hover:underline"
            >
              our forum
            </a>{' '}
            where the Status translation community lives and join in the
            discussion.
          </Text>
        </p>
      </section>

      <div className="border-dashed-default relative z-20 flex flex-col items-center border-t bg-white-100 px-5 py-24 text-center xl:py-40">
        <h4 className="mb-4 text-40 font-bold xl:text-64">Start translating</h4>
        <p className="mb-6 max-w-[574px] text-27">
          Tell us how you want to contribute, and we can find a way to work
          together.
        </p>
        <div className="flex gap-3">
          <DiscussCTA />
        </div>
      </div>
    </Body>
  )
}
