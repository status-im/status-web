'use client'

import { useState } from 'react'

import { customisation, neutral, white } from '@status-im/colors'
import { SegmentedControl } from '@status-im/components'
import { ParentSize } from '@visx/responsive'
import { match } from 'ts-pattern'

import { formatNumber } from '~admin/_utils'

import { CumulativeChart } from './cumulative/chart'
import { MonthlyChart } from './monthly/chart'

export type CumulativeDeviceType = {
  date: string
  verified_devices: number
  unverified_devices: number
}

type Segment = 'cumulative' | 'monthly'

// Monthly data is equal to cumulative data less the unverified devices key so we omit it
export type MonthlyDeviceType = Omit<CumulativeDeviceType, 'unverified_devices'>

type Props = {
  cumulativeData: CumulativeDeviceType[]
  monthlyData: MonthlyDeviceType[]
}

export const colors = {
  line: customisation.blue[50],
  background: neutral[10],
  marker: customisation.blue[50],
  verifiedFill: customisation.blue['50/5'],
  white: white[100],
} as const

const DevicesChart = (props: Props) => {
  const { cumulativeData, monthlyData } = props
  const [activeSegment, setActiveSegment] = useState<Segment>('cumulative')

  const totalDevicesData = cumulativeData.map(
    d => d.verified_devices + d.unverified_devices
  )
  const verifiedDevicesData = cumulativeData.map(d => d.verified_devices)

  const lastTotalDevices = formatNumber(
    totalDevicesData[totalDevicesData.length - 1]
  )

  // last verified devices with decimal separator
  const lastVerifiedDevices = formatNumber(
    verifiedDevicesData[verifiedDevicesData.length - 1]
  )

  return (
    <div className="relative">
      <ParentSize className="w-full rounded-12 border border-neutral-10 bg-white-100 pl-4 pr-[10px] pt-[10px] shadow-2">
        {({ width }) => {
          if (width === 0) {
            return <div style={{ height: 340 }} />
          }

          return (
            <div className="flex flex-col content-between">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-15 font-semibold">Verified devices</p>
                  <div className="inline-flex">
                    <SegmentedControl.Root
                      value={activeSegment}
                      onValueChange={value =>
                        setActiveSegment(value as Segment)
                      }
                      size="24"
                    >
                      <SegmentedControl.Item value="cumulative">
                        Cumulative
                      </SegmentedControl.Item>
                      <SegmentedControl.Item value="monthly">
                        Monthly
                      </SegmentedControl.Item>
                    </SegmentedControl.Root>
                  </div>
                </div>
                <div className="flex items-center gap-1 pt-0.5 text-neutral-100">
                  <p className="text-27 font-semibold">
                    {lastVerifiedDevices}{' '}
                    <span className="pt-1 text-15 font-medium">
                      out of {lastTotalDevices} devices
                    </span>
                  </p>
                </div>
              </div>
              {match(activeSegment)
                .with('cumulative', () => (
                  <CumulativeChart data={cumulativeData} width={width} />
                ))
                .with('monthly', () => (
                  <MonthlyChart data={monthlyData} width={width} />
                ))
                .exhaustive()}
            </div>
          )
        }}
      </ParentSize>
    </div>
  )
}

export { DevicesChart }
