'use client'

import Link from 'next/link'

import { HubLayout } from '~components/hub-layout'
import { AirdropClaimCard, KarmaAdminPanel } from '~components/karma'

export default function KarmaAdminPage() {
  return (
    <HubLayout>
      <div className="mx-auto flex size-full flex-col gap-4 p-4 lg:gap-8 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-27 font-bold text-neutral-100 lg:text-64">
            Karma Admin
          </h1>
          <p className="text-13 font-regular text-neutral-100 lg:text-19">
            Reward distribution and Merkle operations.
          </p>
          <Link
            href="/karma"
            className="text-13 font-medium text-neutral-100 underline"
          >
            Back to Karma
          </Link>
        </div>
        <KarmaAdminPanel />
        <AirdropClaimCard />
      </div>
    </HubLayout>
  )
}
