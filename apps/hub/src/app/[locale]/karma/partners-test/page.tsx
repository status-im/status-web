'use client'

import { useState } from 'react'

import Link from 'next/link'

import { HubLayout } from '~components/hub-layout'
import { AirdropClaimCard, KarmaPartnersPanel } from '~components/karma'

export default function KarmaPartnersTestPage() {
  const [airdropAddress, setAirdropAddress] = useState('')

  return (
    <HubLayout>
      <div className="mx-auto flex size-full flex-col gap-4 p-4 lg:gap-8 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-27 font-bold text-neutral-100 lg:text-64">
            Karma Partners Test
          </h1>
          <p className="text-13 font-regular text-neutral-100 lg:text-19">
            Partner administrative tasks: Merkle tree generation, proof
            creation, and smart contract interactions.
          </p>
          <Link
            href="/karma"
            className="text-13 font-medium text-neutral-100 underline"
          >
            Back to Karma
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="airdrop-contract-address"
            className="text-15 font-semibold text-neutral-100"
          >
            KarmaAirdrop Contract Address
          </label>
          <p className="text-13 text-neutral-50">
            Each partner deploys their own KarmaAirdrop contract. Enter your
            deployed contract address below.
          </p>
          <input
            id="airdrop-contract-address"
            className="rounded-8 border border-neutral-20 px-3 py-2 text-13"
            placeholder="0x..."
            value={airdropAddress}
            onChange={e => setAirdropAddress(e.target.value)}
          />
        </div>

        <KarmaPartnersPanel airdropAddress={airdropAddress} />
        <AirdropClaimCard airdropAddress={airdropAddress} />
      </div>
    </HubLayout>
  )
}
