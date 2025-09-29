import { BulletIcon } from '@status-im/icons/20'

import { Metadata } from '~app/_metadata'
import { formatDate } from '~app/_utils/format-date'
import { Body } from '~components/body'

export const metadata = Metadata({
  title: 'SNT Release Schedule',
})

export default function ReleaseSchedule() {
  return (
    <Body className="pb-24 pt-16 xl:pb-40 xl:pt-32">
      <div className="container max-w-[calc(702px+20px*2)]">
        <div className="mb-12">
          <h1 className="mb-3 text-40 font-bold xl:text-64">
            SNT release schedule
          </h1>
          <p className="text-19 text-neutral-50">
            Last update: {formatDate('2024-07-16', 'long')}
          </p>
        </div>

        <div className="flex flex-col gap-6 py-6">
          <p className="text-19">
            At TGE in 2017, there were 6,804,870,174.87 SNT tokens minted, from
            which:
          </p>
          <ul className="flex flex-col gap-3 text-19">
            <li className="flex items-start gap-2">
              <div className="mt-1.5 flex shrink-0 items-center">
                <BulletIcon className="text-neutral-50" />
              </div>
              <p>
                2,999,015,278 were allocated to the{' '}
                <span className="font-semibold">Public Contributors</span> in
                exchange of ETH; with no lock-up period
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1.5 flex shrink-0 items-center">
                <BulletIcon className="text-neutral-50" />
              </div>
              <p>
                471,505,389 were allocated to{' '}
                <span className="font-semibold">Status Genesis Token</span>{' '}
                holders; with no lock-up period.
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1.5 flex shrink-0 items-center">
                <BulletIcon className="text-neutral-50" />
              </div>
              <p>
                1,360,937,157 were allocated to{' '}
                <span className="font-semibold">Status Core Developers</span>;
                with a 24 month lock-up period and a 6 months cliff.
              </p>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1.5 flex shrink-0 items-center">
                <BulletIcon className="text-neutral-50" />
              </div>
              <p>
                1,973,412,351 were allocated to the{' '}
                <span className="font-semibold">Community Reserve</span>; with a
                12 month lock-up period.
              </p>
            </li>
          </ul>
        </div>

        <div className="pb-6">
          <p className="text-19">
            After 12 months since the TGE, the{' '}
            <span className="font-semibold">Community Reserve</span> has become
            fully available and after 24 months, the{' '}
            <span className="font-semibold">Status Core Developers’</span> SNT
            has also become fully available to the Status Core Developers,
            Founders and Team.
          </p>
        </div>
        <p className="text-19">
          After <span className="font-semibold">Status Core Developers</span>{' '}
          SNT became fully available, these have been used to pay for project
          development costs.
        </p>
      </div>
    </Body>
  )
}
