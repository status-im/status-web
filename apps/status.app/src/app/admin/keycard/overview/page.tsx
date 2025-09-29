import { PieChart } from '../../_components/pie-chart'
import { DevicesChart } from './_components/charts/devices/chart'
import { InteractionsChart } from './_components/charts/interactions/chart'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Keycard',
}

const PIECHART_DATA = {
  database: [
    { id: '20231212', label: '20231212', amount: 500, color: '#7140FD' },
    { id: '20231206', label: '20231206', amount: 100, color: '#FF7D46' },
    { id: '20231028', label: '20231028', amount: 100, color: '#2A799B' },
    {
      id: '20231020',
      label: '20231020',
      amount: 80,
      color: '#F66F8F',
    },
    {
      id: 'older',
      label: 'Older',
      amount: 120,
      color: '#F6B03C',
      children: [
        { id: '20230910', label: '20230910', amount: 60 },
        { id: '20230820', label: '20230820', amount: 40 },
        { id: '20230730', label: '20230730', amount: 20 },
      ],
    },
  ],
  firmware: [
    { id: '1.0.12', label: '1.0.12', amount: 35, color: '#7140FD' },
    { id: '1.0.1', label: '1.0.1', amount: 10, color: '#FF7D46' },
    { id: '1.0.0', label: '1.0.0', amount: 13, color: '#2A799B' },
    {
      id: '0.0.3',
      label: '0.0.3',
      amount: 40,
      color: '#F66F8F',
    },
    {
      id: 'older',
      label: 'Older',
      amount: 30,
      color: '#F6B03C',
    },
  ],
  verificationGap: [
    { id: '1-week', label: '1 week', amount: 90, color: '#7140FD' },
    { id: '1-month', label: '1 month', amount: 20, color: '#FF7D46' },
    { id: '6-month', label: '6 months ago', amount: 15, color: '#2A799B' },
    {
      id: '1-year',
      label: '1 year ago',
      amount: 2,
      color: '#F66F8F',
    },
    {
      id: '2-years',
      label: '2+ years',
      amount: 1,
      color: '#F6B03C',
    },
  ],
}

const CUMULATIVE_DEVICES_DATA = [
  {
    date: '2023-01-01',
    unverified_devices: 1000,
    verified_devices: 500,
  },
  {
    date: '2023-02-01',
    unverified_devices: 1500,
    verified_devices: 1000,
  },
  {
    date: '2023-03-01',
    unverified_devices: 2000,
    verified_devices: 1500,
  },
  {
    date: '2023-04-01',
    unverified_devices: 2500,
    verified_devices: 2000,
  },
  {
    date: '2023-05-01',
    unverified_devices: 3000,
    verified_devices: 2500,
  },
  {
    date: '2023-06-01',
    unverified_devices: 3500,
    verified_devices: 3000,
  },
  {
    date: '2023-07-01',
    unverified_devices: 4000,
    verified_devices: 3500,
  },
  {
    date: '2023-08-01',
    unverified_devices: 4500,
    verified_devices: 4000,
  },
  {
    date: '2023-09-01',
    unverified_devices: 5000,
    verified_devices: 4500,
  },
  {
    date: '2023-10-01',
    unverified_devices: 5500,
    verified_devices: 5000,
  },
  {
    date: '2023-11-01',
    unverified_devices: 4500,
    verified_devices: 10500,
  },
  {
    date: '2023-12-01',
    unverified_devices: 4500,
    verified_devices: 18000,
  },
  {
    date: '2024-01-01',
    unverified_devices: 10000,
    verified_devices: 20250,
  },
]

const DEVICES_DATA = {
  cumulative: CUMULATIVE_DEVICES_DATA,
  // 1 month of data startin at 22 of December 2023
  monthly: [
    {
      date: '2023-12-22',
      verified_devices: 11250,
    },
    {
      date: '2023-12-23',
      verified_devices: 11300,
    },
    {
      date: '2023-12-24',
      verified_devices: 12350,
    },
    {
      date: '2023-12-25',
      verified_devices: 12400,
    },
    {
      date: '2023-12-26',
      verified_devices: 12450,
    },
    {
      date: '2023-12-27',
      verified_devices: 13500,
    },
    {
      date: '2023-12-28',
      verified_devices: 13550,
    },
    {
      date: '2023-12-29',
      verified_devices: 14600,
    },
    {
      date: '2023-12-30',
      verified_devices: 14650,
    },
    {
      date: '2023-12-31',
      verified_devices: 14700,
    },
    {
      date: '2024-01-01',
      verified_devices: 15750,
    },
    {
      date: '2024-01-02',
      verified_devices: 15800,
    },
    {
      date: '2024-01-03',
      verified_devices: 15850,
    },
    {
      date: '2024-01-04',
      verified_devices: 15900,
    },
    {
      date: '2024-01-05',
      verified_devices: 15950,
    },
    {
      date: '2024-01-06',
      verified_devices: 16000,
    },
    {
      date: '2024-01-07',
      verified_devices: 16050,
    },
    {
      date: '2024-01-08',
      verified_devices: 16100,
    },
    {
      date: '2024-01-09',
      verified_devices: 16150,
    },
    {
      date: '2024-01-10',
      verified_devices: 16200,
    },
    {
      date: '2024-01-11',
      verified_devices: 17250,
    },
    {
      date: '2024-01-12',
      verified_devices: 17300,
    },
    {
      date: '2024-01-13',
      verified_devices: 17350,
    },
    {
      date: '2024-01-14',
      verified_devices: 17400,
    },
    {
      date: '2024-01-15',
      verified_devices: 18450,
    },
    {
      date: '2024-01-16',
      verified_devices: 18500,
    },
    {
      date: '2024-01-17',
      verified_devices: 18550,
    },
    {
      date: '2024-01-18',
      verified_devices: 19600,
    },
    {
      date: '2024-01-19',
      verified_devices: 19650,
    },
    {
      date: '2024-01-20',
      verified_devices: 21700,
    },
  ],
}

const INTERACTIONS_DATA = {
  '1M': [
    {
      date: '2023-12-22',
      verifications: 100,
      firmware: 50,
      databases: 50,
    },
    {
      date: '2023-12-23',
      verifications: 150,
      firmware: 75,
      databases: 75,
    },
    {
      date: '2023-12-24',
      verifications: 300,
      firmware: 200,
      databases: 100,
    },
    {
      date: '2023-12-25',
      verifications: 250,
      firmware: 225,
      databases: 125,
    },
    {
      date: '2023-12-26',
      verifications: 300,
      firmware: 150,
      databases: 350,
    },
    {
      date: '2023-12-27',
      verifications: 350,
      firmware: 175,
      databases: 275,
    },
    {
      date: '2023-12-28',
      verifications: 400,
      firmware: 100,
      databases: 200,
    },
    {
      date: '2023-12-29',
      verifications: 450,
      firmware: 225,
      databases: 625,
    },
    {
      date: '2023-12-30',
      verifications: 100,
      firmware: 250,
      databases: 250,
    },
    {
      date: '2023-12-31',
      verifications: 950,
      firmware: 275,
      databases: 275,
    },
    {
      date: '2024-01-01',
      verifications: 600,
      firmware: 300,
      databases: 100,
    },
    {
      date: '2024-01-02',
      verifications: 250,
      firmware: 325,
      databases: 325,
    },
    {
      date: '2024-01-03',
      verifications: 700,
      firmware: 350,
      databases: 650,
    },
    {
      date: '2024-01-04',
      verifications: 750,
      firmware: 375,
      databases: 375,
    },
    {
      date: '2024-01-05',
      verifications: 200,
      firmware: 100,
      databases: 400,
    },
    {
      date: '2024-01-06',
      verifications: 850,
      firmware: 425,
      databases: 425,
    },
    {
      date: '2024-01-07',
      verifications: 900,
      firmware: 450,
      databases: 450,
    },
    {
      date: '2024-01-08',
      verifications: 950,
      firmware: 475,
      databases: 475,
    },
    {
      date: '2024-01-09',
      verifications: 1000,
      firmware: 500,
      databases: 500,
    },
    {
      date: '2024-01-10',
      verifications: 1050,
      firmware: 525,
      databases: 525,
    },
    {
      date: '2024-01-11',
      verifications: 100,
      firmware: 550,
      databases: 350,
    },
    {
      date: '2024-01-12',
      verifications: 1150,
      firmware: 575,
      databases: 175,
    },
    {
      date: '2024-01-13',
      verifications: 200,
      firmware: 400,
      databases: 600,
    },
    {
      date: '2024-01-14',
      verifications: 1750,
      firmware: 625,
      databases: 225,
    },
    {
      date: '2024-01-15',
      verifications: 100,
      firmware: 250,
      databases: 350,
    },
    {
      date: '2024-01-16',
      verifications: 1350,
      firmware: 675,
      databases: 175,
    },
    {
      date: '2024-01-17',
      verifications: 1400,
      firmware: 700,
      databases: 300,
    },
    {
      date: '2024-01-18',
      verifications: 150,
      firmware: 725,
      databases: 725,
    },
    {
      date: '2024-01-19',
      verifications: 1500,
      firmware: 750,
      databases: 750,
    },
    {
      date: '2024-01-20',
      verifications: 2550,
      firmware: 875,
      databases: 775,
    },
  ],
  '7D': [
    {
      date: '2024-01-14',
      verifications: 140,
      firmware: 350,
      databases: 120,
    },
    {
      date: '2024-01-15',

      verifications: 900,
      firmware: 500,
      databases: 200,
    },
    {
      date: '2024-01-16',
      verifications: 200,
      firmware: 200,
      databases: 230,
    },
    {
      date: '2024-01-17',
      verifications: 250,
      firmware: 120,
      databases: 150,
    },
    {
      date: '2024-01-18',
      verifications: 300,
      firmware: 150,
      databases: 100,
    },
    {
      date: '2024-01-19',
      verifications: 300,
      firmware: 200,
      databases: 500,
    },
    {
      date: '2024-01-20',
      verifications: 800,
      firmware: 200,
      databases: 600,
    },
  ],
  '1Y': [
    {
      date: '2024-01-01',
      verifications: 300,
      firmware: 200,
      databases: 500,
    },
    {
      date: '2024-02-01',
      verifications: 150,
      firmware: 750,
      databases: 750,
    },
    {
      date: '2024-03-01',
      verifications: 200,
      firmware: 100,
      databases: 100,
    },
    {
      date: '2024-04-01',
      verifications: 250,
      firmware: 125,
      databases: 125,
    },
    {
      date: '2024-05-01',
      verifications: 300,
      firmware: 150,
      databases: 150,
    },
    {
      date: '2024-06-01',
      verifications: 350,
      firmware: 175,
      databases: 175,
    },
    {
      date: '2024-07-01',
      verifications: 400,
      firmware: 200,
      databases: 200,
    },
    {
      date: '2024-08-01',
      verifications: 450,
      firmware: 225,
      databases: 225,
    },
    {
      date: '2024-09-01',
      verifications: 500,
      firmware: 250,
      databases: 250,
    },
    {
      date: '2024-10-01',
      verifications: 550,
      firmware: 275,
      databases: 275,
    },
    {
      date: '2024-11-01',
      verifications: 600,
      firmware: 300,
      databases: 300,
    },
    {
      date: '2024-12-01',
      verifications: 650,
      firmware: 325,
      databases: 325,
    },
    {
      date: '2025-01-01',
      verifications: 700,
      firmware: 350,
      databases: 350,
    },
  ],
  '2Y': [
    {
      date: '2023-01-01',
      verifications: 100,
      firmware: 50,
      databases: 50,
    },
    {
      date: '2023-02-01',
      verifications: 150,
      firmware: 75,
      databases: 75,
    },
    {
      date: '2023-03-01',
      verifications: 200,
      firmware: 100,
      databases: 100,
    },
    {
      date: '2023-04-01',
      verifications: 250,
      firmware: 125,
      databases: 125,
    },
    {
      date: '2023-05-01',
      verifications: 300,
      firmware: 150,
      databases: 150,
    },
    {
      date: '2023-06-01',
      verifications: 350,
      firmware: 175,
      databases: 275,
    },
    {
      date: '2023-07-01',
      verifications: 400,
      firmware: 200,
      databases: 500,
    },
    {
      date: '2023-08-01',
      verifications: 450,
      firmware: 225,
      databases: 425,
    },
    {
      date: '2023-09-01',
      verifications: 500,
      firmware: 250,
      databases: 250,
    },
    {
      date: '2023-10-01',
      verifications: 550,
      firmware: 275,
      databases: 575,
    },
    {
      date: '2023-11-01',
      verifications: 600,
      firmware: 600,
      databases: 300,
    },
    {
      date: '2023-12-01',
      verifications: 650,
      firmware: 925,
      databases: 325,
    },
    {
      date: '2024-01-01',
      verifications: 700,
      firmware: 350,
      databases: 350,
    },
    {
      date: '2024-02-01',
      verifications: 750,
      firmware: 375,
      databases: 375,
    },
    {
      date: '2024-03-01',
      verifications: 800,
      firmware: 400,
      databases: 400,
    },
    {
      date: '2024-04-01',
      verifications: 850,
      firmware: 425,
      databases: 425,
    },
    {
      date: '2024-05-01',
      verifications: 900,
      firmware: 450,
      databases: 450,
    },
    {
      date: '2024-06-01',
      verifications: 950,
      firmware: 475,
      databases: 475,
    },
    {
      date: '2024-07-01',
      verifications: 1000,
      firmware: 500,
      databases: 500,
    },
    {
      date: '2024-08-01',
      verifications: 1050,
      firmware: 525,
      databases: 525,
    },
    {
      date: '2024-09-01',
      verifications: 1100,
      firmware: 550,
      databases: 550,
    },
    {
      date: '2024-10-01',
      verifications: 1150,
      firmware: 575,
      databases: 575,
    },
    {
      date: '2024-11-01',
      verifications: 1200,
      firmware: 600,
      databases: 600,
    },
    {
      date: '2024-12-01',
      verifications: 1250,
      firmware: 625,
      databases: 625,
    },
    {
      date: '2025-01-01',
      verifications: 1300,
      firmware: 650,
      databases: 650,
    },
  ],
}

export default function KeycardOverviewPage() {
  return (
    <main className="grow overflow-x-hidden p-6 md:overflow-y-auto md:p-12">
      <h1 className="pb-1 text-27 font-semibold">Keycard</h1>
      <p className="text-13 md:text-15">
        Manage keycard devices, databases, and firmwares.
      </p>
      <div className="grid grid-cols-1 gap-4 pt-6 2xl:grid-cols-2">
        <DevicesChart
          cumulativeData={DEVICES_DATA.cumulative}
          monthlyData={DEVICES_DATA.monthly}
        />
        <InteractionsChart data={INTERACTIONS_DATA} />
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="flex w-full select-none flex-col rounded-16 border border-neutral-10 shadow-1">
          <PieChart
            data={PIECHART_DATA.database}
            title="Database"
            url="/admin/keycard/databases"
            hoveredCaption="devices"
          />
        </div>
        <div className="flex w-full select-none flex-col rounded-16 border border-neutral-10 shadow-1">
          <PieChart
            data={PIECHART_DATA.firmware}
            title="Firmware"
            url="/admin/keycard/firmwares"
            hoveredCaption="devices"
            delay={200}
          />
        </div>
        <div className="flex w-full select-none flex-col rounded-16 border border-neutral-10 shadow-1">
          <PieChart
            data={PIECHART_DATA.verificationGap}
            title="Verification Gap"
            hoveredCaption="devices"
            delay={400}
          />
        </div>
      </div>
    </main>
  )
}
