import { parseEther } from 'viem'

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

const meta: Meta = {
  title: 'Hub/Karma Progress',
  parameters: {
    layout: 'padded',
  },
  render: () => {
    const karmaLevels = generateKarmaLevels()
    const karmaValues = [
      0, 0.8, 1, 45.56, 50, 480.54, 500, 5000, 18999, 456999, 8999999, 18999999,
    ]

    return (
      <div className="flex w-full flex-col gap-8">
        {karmaValues.map((karma, index) => (
          <div key={index} className="w-full">
            <KarmaProgressBar
              currentKarma={parseEther(String(karma))}
              karmaLevels={karmaLevels}
            />
          </div>
        ))}
      </div>
    )
  },
}

export default meta

type Story = StoryObj

export const AllLevels: Story = {}
