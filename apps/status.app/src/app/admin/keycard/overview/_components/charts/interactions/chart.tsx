'use client'

import { useState } from 'react'

import { DropdownButton, DropdownMenu } from '@status-im/components'
import { ParentSize } from '@visx/responsive'

import { Legend } from '../legend'
import { Chart } from './content'

import type { TimeFrame } from '~components/charts/utils'

export type InteractionsType = {
  date: string
  verifications: number
  firmware: number
  databases: number
}

export type VisibleInteractionsType =
  | 'total'
  | 'verifications'
  | 'firmware'
  | 'databases'

export type InteractionsTimeFrame = Exclude<TimeFrame, '24H' | '3M' | 'All'>

type Props = {
  data: Record<InteractionsTimeFrame, InteractionsType[]>
}
// defining colors
export const colors = {
  // Customisation Blue 50
  line: '#2A4AF5',
  background: '#F0F2F5',
  marker: '#2A4AF5',
  verifications: '#2A799B',
  firmware: '#F6B03C',
  databases: '#EC266C',
  total: '#2A4AF5',
  fill: 'linear-gradient(180deg, rgba(42,74,245,1) 0%, rgba(255,255,255,1) 100%)',
  white: '#FFF',
} as const

type InteractionOptionType = {
  label: string
  value: VisibleInteractionsType
}

type RangeOptionType = {
  label: string
  value: InteractionsTimeFrame
}

const INTERACTIONS_OPTIONS: InteractionOptionType[] = [
  { label: 'Total', value: 'total' },
  { label: 'Verifications', value: 'verifications' },
  { label: 'Firmware', value: 'firmware' },
  { label: 'Databases', value: 'databases' },
]

const PRESET_RANGES: RangeOptionType[] = [
  { label: 'Week', value: '7D' },
  { label: 'Month', value: '1M' },
  { label: 'Year', value: '1Y' },
  { label: '2 Years', value: '2Y' },
]

const InteractionsChart = (props: Props) => {
  const { data: dataFromProps } = props

  const [activeRange, setActiveRange] = useState<InteractionsTimeFrame>('1M')
  const [visibleInteractions, setVisibleInteractions] = useState<
    VisibleInteractionsType[]
  >(['total', 'databases', 'firmware', 'verifications'])

  const [isOpenInteractionsOptions, setIsOpenInteractionsOptions] =
    useState(false)
  const [isOpenRangeOptions, setIsOpenRangeOptions] = useState(false)

  const data = dataFromProps[activeRange]
  const totalInteractionsData =
    data[data.length - 1].verifications +
    data[data.length - 1].firmware +
    data[data.length - 1].databases

  const handleInteractionsOptions = ({
    isChecked,
    value,
  }: {
    isChecked: boolean
    value: VisibleInteractionsType
  }) => {
    if (isChecked) {
      setVisibleInteractions(
        visibleInteractions.filter(interaction => interaction !== value)
      )
    } else {
      setVisibleInteractions([...visibleInteractions, value])
    }
  }

  return (
    <div className="relative">
      <ParentSize className="w-full rounded-12 border border-neutral-10 bg-white-100 pl-4 pr-[10px] pt-[10px] shadow-2">
        {({ width }) => {
          if (width === 0) {
            return <div style={{ height: 340 }} />
          }

          return (
            <>
              <div className="flex items-center justify-between">
                <p className="text-15 font-semibold">Interactions</p>
                <div className="flex items-center gap-2">
                  <DropdownMenu.Root
                    onOpenChange={() =>
                      setIsOpenInteractionsOptions(!isOpenInteractionsOptions)
                    }
                    modal={false}
                  >
                    <DropdownButton variant="outline" size="24">
                      Interactions
                    </DropdownButton>
                    <DropdownMenu.Content align="end">
                      <div className="max-h-96 overflow-y-auto">
                        {INTERACTIONS_OPTIONS.filter(
                          option => option.value !== 'total'
                        ).map(option => {
                          const isChecked = visibleInteractions.includes(
                            option.value
                          )
                          return (
                            <DropdownMenu.CheckboxItem
                              key={option.value}
                              label={option.label}
                              checked={isChecked}
                              onSelect={e => e.preventDefault()}
                              onCheckedChange={() =>
                                handleInteractionsOptions({
                                  isChecked,
                                  value: option.value,
                                })
                              }
                            />
                          )
                        })}
                      </div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                  <DropdownMenu.Root
                    onOpenChange={() =>
                      setIsOpenRangeOptions(!isOpenRangeOptions)
                    }
                    modal={false}
                  >
                    <DropdownButton variant="outline" size="24">
                      {
                        PRESET_RANGES.find(range => range.value === activeRange)
                          ?.label
                      }
                    </DropdownButton>
                    <DropdownMenu.Content align="end">
                      <div className="max-h-96 overflow-y-auto">
                        {PRESET_RANGES.map(option => {
                          return (
                            <DropdownMenu.Item
                              selected={option.value === activeRange}
                              key={option.value}
                              label={option.label}
                              onSelect={() => setActiveRange(option.value)}
                            />
                          )
                        })}
                      </div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              </div>
              <div className="flex items-center gap-1 pt-0.5 text-neutral-100">
                <p className="flex items-end gap-2 text-27 font-semibold">
                  {totalInteractionsData}
                </p>
              </div>
              <Chart
                data={data}
                width={width}
                visibleInteractions={visibleInteractions}
                activeRange={activeRange}
              />
              <Legend
                data={visibleInteractions.map(interaction => {
                  return {
                    color: colors[interaction],
                    label:
                      INTERACTIONS_OPTIONS.find(
                        option => option.value === interaction
                      )?.label || interaction,
                  }
                })}
              />
            </>
          )
        }}
      </ParentSize>
    </div>
  )
}

export { InteractionsChart }
