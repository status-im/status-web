import { parseEther } from 'viem'

import { type KarmaLevel, KarmaProgressBar } from './karma-progress'

import type { Meta, StoryObj } from '@storybook/react'

const generateKarmaLevels = (): KarmaLevel[] => {
  const levels: KarmaLevel[] = []
  const baseValues = [
    0n,
    parseEther('1'),
    parseEther('2'),
    parseEther('51'),
    parseEther('501'),
    parseEther('5001'),
    parseEther('20001'),
    parseEther('100001'),
    parseEther('500001'),
    parseEther('5000001'),
    parseEther('10000001'),
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
  currentKarma: string
}

const meta: Meta<StoryArgs> = {
  title: 'Hub/Karma Progress',
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    currentKarma: {
      control: 'text',
      description:
        'Current karma amount (in ETH, e.g., "0", "75", "10000", "15000000")',
    },
  },
  args: {
    currentKarma: '0',
  },
  render: (args: StoryArgs) => {
    const karmaLevels = generateKarmaLevels()
    const currentKarma = parseEther(args.currentKarma || '0')

    return (
      <KarmaProgressBar currentKarma={currentKarma} karmaLevels={karmaLevels} />
    )
  },
}

export default meta

type Story = StoryObj<StoryArgs>

export const Default: Story = {
  args: {
    currentKarma: '0',
  },
}
