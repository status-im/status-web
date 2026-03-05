// Note: all files under /admin-panel are for testing. Please don't review this file

'use client'

import { Button } from '@status-im/status-network/components'

import { useAirdropClaim } from './use-airdrop-claim'

type AirdropClaimCardProps = {
  airdropAddress: string
}

export function AirdropClaimCard({ airdropAddress }: AirdropClaimCardProps) {
  const {
    merkleJson,
    setMerkleJson,
    parsed,
    myEntry,
    isPending,
    isConnected,
    preflightNote,
    handleClaim,
  } = useAirdropClaim(airdropAddress)

  return (
    <div className="min-h-[200px] w-full overflow-hidden rounded-8 border border-neutral-10 bg-white-100">
      <div className="flex h-full flex-col items-start p-4">
        <div className="flex w-full flex-col gap-0.5">
          <p className="text-15 font-regular text-neutral-50">Karma Airdrop</p>
          <p className="text-13 text-neutral-70">
            Paste the Merkle output JSON from Step 3, then claim from the
            recipient wallet.
          </p>
        </div>

        <div className="mt-2.5 flex w-full flex-col gap-2">
          <textarea
            className="min-h-24 w-full rounded-8 border border-neutral-20 px-3 py-2 font-mono text-13"
            placeholder='{"root":"0x...","entries":[{"index":"0","account":"0x...","amount":"1","proof":["0x..."]}]}'
            value={merkleJson}
            onChange={e => setMerkleJson(e.target.value)}
          />
          {parsed.error ? (
            <span className="text-13 text-danger-50">{parsed.error}</span>
          ) : (
            <span className="text-13 text-neutral-70">
              {myEntry
                ? `Claimable amount: ${myEntry.amount.toString()} (index: ${myEntry.index.toString()}, proof items: ${myEntry.proof.length})`
                : 'No claimable entry detected for connected wallet'}
            </span>
          )}
          {preflightNote ? (
            <span className="text-13 text-neutral-70">{preflightNote}</span>
          ) : null}
          <Button
            variant="primary"
            size="40"
            onClick={handleClaim}
            disabled={isPending || !isConnected}
            className="w-full items-center justify-center"
          >
            {isPending ? 'Claiming...' : 'Claim Airdrop'}
          </Button>
        </div>
      </div>
    </div>
  )
}
