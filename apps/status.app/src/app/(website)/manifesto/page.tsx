import { Tag, Text } from '@status-im/components'
import { cx } from 'class-variance-authority'
import { Caveat } from 'next/font/google'

import { Metadata } from '~app/_metadata'
import { Body } from '~components/body'
import { ParallaxCircle } from '~website/_components/parallax-circle'
import { getStatusJobs } from '~website/_lib/greenhouse'

import { CircleWord } from '../_components/circle-word'
import { LogoStatus } from './_components/logo-status'
import { Prefooter } from './_components/pre-footer'
import { Principle } from './_components/principle'

const caveat = Caveat({
  variable: '--font-caveat',
  weight: ['700'],
  subsets: ['latin'],
})

export const metadata = Metadata({
  title: 'Manifesto',
  description:
    'Create an open decentralised platform that defends human rights, enables free speech, protects privacy and promotes sovereignty.',
})

export default async function ManifestoPage() {
  const { meta } = await getStatusJobs()

  const jobsCount = meta?.total ?? 0

  return (
    <Body>
      <div className="container relative flex flex-col items-center py-16 xl:py-40">
        <ParallaxCircle
          color="pink"
          className="left-[-358px] top-[-274px] xl:left-0"
        />
        <div className="mb-4">
          <Tag size="32" label="Manifesto" />
        </div>
        <h1 className="relative z-20 mb-4 text-center text-48 font-bold xl:mb-6 xl:text-88">
          Uphold
          <br />
          human rights
        </h1>

        <div className="relative z-20 max-w-[574px] whitespace-pre-line text-center">
          <Text size={27}>
            Create an open decentralised platform that defends human rights,
            enables free speech, protects privacy and promotes sovereignty.
          </Text>
        </div>
        <ParallaxCircle
          color="purple"
          className="top-[420px] hidden xl:right-0 xl:block"
        />
      </div>

      <ParallaxCircle
        color="orange"
        className="left-[-282px] top-[530px] xl:left-0 xl:top-[730px]"
      />

      {/* MISSION */}
      <div className="container relative">
        <div className="flex flex-col items-center">
          <p className="max-w-[702px] text-27 font-regular xl:text-40 xl:font-regular">
            Our mission is to empower individuals to achieve their aspirations
            and create a better future for all, by leveraging innovative
            decentralised technologies to create a virtual space where{' '}
            <CircleWord imageId="Manifesto/Scribbles and Notes/Scribble_01:527:180">
              freedom
            </CircleWord>
            , liberty, and human sovereignty are protected, and censorship
            resistance is ensured.
            <br />
            <br />
            We believe that a free cyberspace will enable people to innovate and
            experiment with new forms of{' '}
            <CircleWord imageId="Manifesto/Scribbles and Notes/Scribble_02:431:183">
              human
            </CircleWord>{' '}
            organisation and societal governance, freed from the constraints
            imposed by centralised institutions and monopolistic tech platforms.
            <br />
            <br />
            Our existence defends civil liberties and free speech, and aims to
            gift the world a platform that creates a new bazaar of open,
            decentralised and permissionless innovation, directly accessible by
            every individual worldwide.
          </p>
        </div>
      </div>

      {/* PRINCIPLES */}
      <div className="relative">
        <ParallaxCircle color="purple" className="left-0" />
        <ParallaxCircle
          color="pink"
          className="left-0 top-[-80px] hidden xl:block"
        />
        <ParallaxCircle color="sky" className="right-0 top-[400px]" />
        <ParallaxCircle color="orange" className="left-[220px] top-[400px]" />
        <ParallaxCircle color="sky" className="right-[200px] top-0" />

        <div className="container relative flex flex-col items-center pb-24 xl:pb-40">
          <div className="z-20 py-24 xl:py-40">
            <div className="mx-16 aspect-[0.855]">
              <LogoStatus />
            </div>
          </div>
          <div
            className={cx(
              'relative flex max-w-[702px] flex-col gap-10',
              caveat.variable
            )}
          >
            <ParallaxCircle
              color="blue"
              className="left-[52px] top-[960px] xl:left-auto xl:right-[-260px] xl:top-0"
            />
            <ParallaxCircle
              color="orange"
              className="bottom-0 left-[-338px] xl:bottom-[76px] xl:left-[-260px]"
            />
            <h2 id="principles" className="scroll-mt-20 text-40 font-600">
              Our principles
            </h2>
            {PRINCIPLES.map((mission, index) => (
              <Principle
                key={index}
                number={mission.number}
                title={mission.title}
                description={mission.description}
              />
            ))}
          </div>
        </div>

        <Prefooter jobsCount={jobsCount} />
      </div>
    </Body>
  )
}

const PRINCIPLES = [
  {
    number: 'I',
    title: 'Liberty',
    description:
      'We believe in the sovereignty of individuals. As a platform that stands for the cause of personal liberty, we aim to maximise social, political, and economic freedoms. This includes being coercion-resistant.',
  },
  {
    number: 'II',
    title: 'Censorship resistance',
    description:
      'We enable free flow of information. No content is under surveillance. We abide by the cryptoeconomic design principle of censorship resistance. Even stronger, Status is an agnostic platform for information.',
  },
  {
    number: 'III',
    title: 'Security',
    description:
      "We don't compromise on security when building features. We use state-of-the-art technologies, and research new security methods and technologies to make strong security guarantees.",
  },
  {
    number: 'IV',
    title: 'Privacy',
    description:
      'Privacy is the power to selectively reveal oneself to the world. For us, it’s essential to protect privacy in both communications and transactions, as well as being a pseudo-anonymous platform. Additionally, we strive to provide the right of total anonymity.',
  },
  {
    number: 'V',
    title: 'Transparency',
    description:
      'We strive for complete openness and symmetry of information within the organisation, and have no border between our core contributors and our community. We are frank about our shortcomings, especially when making short-term tradeoffs in service of our long-term goals.',
  },
  {
    number: 'VI',
    title: 'Openness',
    description:
      'The software we create is a public good. It is made available via a free and open source licence, for anyone to share, modify and benefit from. We believe in permission-less participation.',
  },
  {
    number: 'VII',
    title: 'Decentralisation',
    description:
      'We minimise centralisation across both the software and the organisation itself. In other words, we maximise the number of physical computers composing the network, and maximise the number of individuals who have control over the system(s) we are building.',
  },
  {
    number: 'VIII',
    title: 'Inclusivity',
    description:
      'We believe in fair and widespread access to our software, with an emphasis on ease-of-use. This also extends to social inclusivity, permissionless participation, interoperability, and investing in educational efforts.',
  },
  {
    number: 'IX',
    title: 'Continuance',
    description:
      'We create software incentivized to continue to exist and improve, without the stewardship of a single entity or any of the current team members.',
  },
  {
    number: 'X',
    title: 'Resourcefulness',
    description:
      'We are relentlessly resourceful. As we grow and have ready access to capital, it is our obligation to token holders to fight bureaucracy and inefficiencies within the organisation. This means solving problems in the most effective way possible at lower economic costs (in terms of capital, time and resources).',
  },
]
