import { DISCUSS_URL, MESSARI_URL } from '~/config/routes'
import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { FeatureList } from '~website/_components/feature-list'
import { ParallaxCircle } from '~website/_components/parallax-circle'

import { CircleWord } from '../_components/circle-word'
import { HeroSection } from '../_components/hero-section'

export const metadata = Metadata({
  title: 'SNT',
  description: 'SNT is Status’ community token',
})

export default function TokenPage() {
  return (
    <Body>
      <div className="relative">
        <div className="relative z-30">
          <ParallaxCircle
            color="blue"
            className="right-6 top-[-266px] xl:right-0"
          />
        </div>
        <div className="relative z-10">
          <HeroSection
            tag="Token"
            title="SNT is Status’ community token"
            description="Curate the Status Community Directory, vote on future development priorities and reserve your ENS name, all with SNT."
            video={{
              id: 'Token/Animations/Token_Hero:721:575',
              posterId: 'Token/Animations/Frames/Token_Hero_Frame:721:575',
            }}
          />
        </div>
      </div>

      <section className="container-lg relative py-12 xl:py-30">
        <ParallaxCircle color="blue" className="left-5 top-[282px]" />
        <div className="relative mx-auto max-w-[742px]">
          <h3 className="text-27 font-regular xl:text-40">
            SNT is an{' '}
            <CircleWord imageId="Token/Scribbles and Notes/Scribble_01:472:181">
              ERC-20
            </CircleWord>{' '}
            token that helps to govern, access and power the{' '}
            <CircleWord imageId="Token/Scribbles and Notes/Scribble_02:800:180">
              decentralised
            </CircleWord>{' '}
            Status applications, services and p2p networks.
            <br />
            <br />
            The Status community is continuously considering new uses for the
            token, for example SNT{' '}
            <CircleWord imageId="Token/Scribbles and Notes/Scribble_03:470:180">
              staking.
            </CircleWord>
          </h3>
        </div>
      </section>

      <section className="pb-24 pt-12 xl:pb-40 xl:pt-20">
        <FeatureList
          list={[
            {
              title: 'Vote for communities',
              description:
                'Help curate the communities that all Status users will see in the Community Directory by voting with your SNT.',
              icon: 'Token/Icons/Icon Section/01_Vote_for_Communities:144:144',
            },
            {
              title: 'Help prioritise initiatives',
              description:
                'Play a part in prioritising new Status initiatives by upvoting proposals that you would like to see actioned.',
              icon: 'Token/Icons/Icon Section/02_Help_Prioritize_Features:145:144',
            },
            {
              title: 'Create ENS name',
              description:
                'Lock up SNT to generate your ENS subdomain to have a personalised and easy-to-use address.',
              icon: 'Token/Icons/Icon Section/03_Create_ENS_Name:145:144',
            },
            {
              title: 'A trusted token',
              description:
                'Has served, been used by and provided utility to the Status community since its launch in 2017.',
              icon: 'Token/Icons/Icon Section/04_A_Trusted_Token:144:144',
              link: {
                label: 'Messari disclosure registry',
                href: MESSARI_URL,
              },
            },
            {
              title: 'Research',
              description:
                'Contributors from around the world conduct research on possible future use cases for SNT.',
              icon: 'Token/Icons/Icon Section/05_Research:145:144',
              link: {
                label: 'Join the discussion',
                href: DISCUSS_URL,
              },
            },
            {
              title: 'Always improving',
              description:
                'Check back frequently to learn about exciting new use cases for putting your SNT to work with Status.',
              icon: 'Token/Icons/Icon Section/06_Always_Improving:145:144',
              link: {
                label: 'Visit our blog',
                href: '/blog',
              },
            },
          ]}
        />
      </section>
    </Body>
  )
}
