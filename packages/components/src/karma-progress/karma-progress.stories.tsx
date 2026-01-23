import { formatEther, parseEther } from 'viem'

import { type KarmaLevel, KarmaProgressBar } from './karma-progress'

import type { Meta, StoryObj } from '@storybook/react'

const generateKarmaLevels = (): KarmaLevel[] => {
  const levels: KarmaLevel[] = []
  const baseValues = [
    0n,
    parseEther('1'),
    parseEther('1.000000000000000001'),
    parseEther('50'),
    parseEther('500'),
    parseEther('5000'),
    parseEther('20000'),
    parseEther('100000'),
    parseEther('500000'),
    parseEther('5000000'),
    parseEther('10000000'),
  ]

  for (let i = 0; i < baseValues.length; i++) {
    levels.push({
      level: i,
      minKarma: baseValues[i],
      maxKarma:
        i < baseValues.length - 1
          ? baseValues[i + 1] - 1n
          : baseValues[i] * 10n,
    })
  }

  return levels
}

type StoryArgs = {
  karmaDefault0: number
  karmaDefault0_80: number
  karmaDefault1: number
  karmaDefault45_56: number
  karmaDefault50: number
  karmaDefault480_54: number
  karmaDefault500: number
  karmaDefault5000: number
  karmaDefault18999: number
  karmaDefault456999: number
  karmaDefault8999999: number
  karmaDefault18999999: number
}

const meta: Meta<StoryArgs> = {
  title: 'Hub/Karma Progress',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    karmaDefault0: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 0)',
    },
    karmaDefault0_80: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 0.8)',
    },
    karmaDefault1: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 1)',
    },
    karmaDefault45_56: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 45.56)',
    },
    karmaDefault50: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 50)',
    },
    karmaDefault480_54: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 480.54)',
    },
    karmaDefault500: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 500)',
    },
    karmaDefault5000: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 5000)',
    },
    karmaDefault18999: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 18999)',
    },
    karmaDefault456999: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 456999)',
    },
    karmaDefault8999999: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 8999999)',
    },
    karmaDefault18999999: {
      control: { type: 'number', min: 0 },
      description: 'Karma value (default: 18999999)',
    },
  },
  args: {
    karmaDefault0: 0,
    karmaDefault0_80: 0.8,
    karmaDefault1: 1,
    karmaDefault45_56: 45.56,
    karmaDefault50: 50,
    karmaDefault480_54: 480.54,
    karmaDefault500: 500,
    karmaDefault5000: 5000,
    karmaDefault18999: 18999,
    karmaDefault456999: 456999,
    karmaDefault8999999: 8999999,
    karmaDefault18999999: 18999999,
  },
  render: (args: StoryArgs) => {
    const karmaLevels = generateKarmaLevels()
    const karmaValues = [
      args.karmaDefault0,
      args.karmaDefault0_80,
      args.karmaDefault1,
      args.karmaDefault45_56,
      args.karmaDefault50,
      args.karmaDefault480_54,
      args.karmaDefault500,
      args.karmaDefault5000,
      args.karmaDefault18999,
      args.karmaDefault456999,
      args.karmaDefault8999999,
      args.karmaDefault18999999,
    ]

    const formatKarma = (amount: string) => {
      const num = Number(amount)
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      return formatter.format(num)
    }

    return (
      <div className="mb-8 flex w-full flex-col gap-12">
        {karmaValues.map((karma, index) => {
          const karmaBigInt = parseEther(String(karma))
          const formattedKarma = formatKarma(formatEther(karmaBigInt))

          return (
            <div key={index} className="w-full">
              <KarmaProgressBar
                currentKarma={karmaBigInt}
                karmaLevels={karmaLevels}
                formattedKarma={formattedKarma}
              />
            </div>
          )
        })}
      </div>
    )
  },
}

export default meta

type Story = StoryObj<StoryArgs>

export const AllLevels: Story = {}
