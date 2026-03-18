import { useEffect, useState } from 'react'

import { Button } from '@status-im/components'
import { CloseIcon } from '@status-im/icons/20'

import ethereumIcon from '../../assets/networks/ethereum.png'
import statusNetworkIcon from '../../assets/networks/status-network.png'
import {
  getPendingApproval,
  type PendingApproval,
  setApprovalResult,
} from '../../lib/approval'
import { apiClient } from '../../providers/api-client'

const CHAIN_NAMES: Record<string, string> = {
  '0x1': 'Mainnet',
  '0x6300b5ea': 'Status Network Sepolia',
}

function getChainName(chainId: string): string {
  return CHAIN_NAMES[chainId] ?? `Chain ${parseInt(chainId, 16)}`
}

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-3)}`
}

function hexToReadableMessage(hex: string): string {
  try {
    const clean = hex.startsWith('0x') ? hex.slice(2) : hex
    const bytes = new Uint8Array(
      clean.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)),
    )
    return new TextDecoder().decode(bytes)
  } catch {
    return hex
  }
}

export function ApprovalPage() {
  const [approval, setApproval] = useState<PendingApproval | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState('')
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [unlockError, setUnlockError] = useState<string | null>(null)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  useEffect(() => {
    getPendingApproval().then(setApproval)
    apiClient.session.status.query().then(status => {
      setIsSessionActive(status.isUnlocked)
      setIsCheckingSession(false)
    })
  }, [])

  if (!approval || isCheckingSession) {
    return null
  }

  const needsPassword = !isSessionActive

  const handleUnlock = async () => {
    setIsSubmitting(true)
    setUnlockError(null)
    try {
      await apiClient.session.unlock.mutate({ password })
      setIsSessionActive(true)
    } catch {
      setUnlockError('Incorrect password')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Password gate — shown before any approval content when wallet is locked
  if (needsPassword) {
    return (
      <div
        data-customisation="blue"
        className="flex h-screen flex-col items-center justify-center bg-white-100 p-4"
      >
        <h1 className="mb-4 text-19 font-semibold text-neutral-100">
          Unlock wallet
        </h1>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && password) handleUnlock()
          }}
          placeholder="Enter password"
          className="mb-2 h-10 w-full max-w-[280px] rounded-12 border border-neutral-20 bg-white-100 px-3 text-15 text-neutral-100 outline-none placeholder:text-neutral-40 focus:border-customisation-50"
        />
        {unlockError && (
          <p className="mb-2 text-13 text-danger-50">{unlockError}</p>
        )}
        <div className="mt-2 grid w-full max-w-[280px] grid-cols-2 gap-3">
          <Button
            variant="grey"
            onPress={() => {
              setApprovalResult({ id: approval.id, approved: false })
              window.close()
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onPress={handleUnlock}
            disabled={isSubmitting || !password}
          >
            Unlock
          </Button>
        </div>
      </div>
    )
  }

  const isSign = approval.type === 'personal_sign'

  const respond = async (approved: boolean) => {
    if (!approval || isSubmitting) return
    setIsSubmitting(true)

    await setApprovalResult({
      id: approval.id,
      approved,
    })
    window.close()
  }

  return (
    <div
      data-customisation="blue"
      className="flex h-screen flex-col bg-white-100 p-4"
    >
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-27 font-semibold text-neutral-100">
          {isSign ? 'Sign message' : 'Connect dApp'}
        </h1>
        <Button
          icon={<CloseIcon />}
          aria-label="Close"
          variant="outline"
          size="32"
          onPress={() => respond(false)}
        />
      </div>

      <p className="mb-2 text-13 font-medium text-neutral-50">dApp</p>
      <div className="mb-4 rounded-16 border border-neutral-10 p-3">
        <div className="flex items-center gap-3">
          <img
            src={approval.favicon}
            alt=""
            className="size-8 rounded-8"
            onError={e => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-15 font-semibold text-neutral-100">
              {approval.title}
            </p>
            <p className="truncate text-13 text-neutral-50">
              {approval.origin}
            </p>
          </div>
        </div>
      </div>

      {isSign ? (
        <SignContent approval={approval} />
      ) : (
        <ConnectContent approval={approval} />
      )}

      <div className="mt-auto grid grid-cols-2 gap-3 py-3">
        <Button
          variant="grey"
          onPress={() => respond(false)}
          disabled={isSubmitting}
        >
          Decline
        </Button>
        <Button
          variant="primary"
          onPress={() => respond(true)}
          disabled={isSubmitting}
        >
          {isSign ? 'Sign' : 'Connect'}
        </Button>
      </div>
    </div>
  )
}

function AccountInfo({ address }: { address: string }) {
  return (
    <>
      <p className="mb-2 text-13 font-medium text-neutral-50">Account</p>
      <div className="mb-4 rounded-16 border border-neutral-10 p-3">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-customisation-50/20">
            🍑
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-15 font-semibold text-neutral-100">Account 1</p>
            <p className="text-13 text-neutral-50">
              {truncateAddress(address)}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

const CHAIN_ICONS: Record<string, string> = {
  '0x1': ethereumIcon,
  '0x6300b5ea': statusNetworkIcon,
}

function NetworkInfo({ chainId }: { chainId: string }) {
  const icon = CHAIN_ICONS[chainId]

  return (
    <>
      <p className="mb-2 text-13 font-medium text-neutral-50">Network</p>
      <div className="mb-4 rounded-16 border border-neutral-10 p-3">
        <div className="flex items-center gap-2">
          {icon ? (
            <img src={icon} alt="" className="size-8 rounded-full" />
          ) : (
            <span className="flex size-8 items-center justify-center rounded-full bg-neutral-20 text-11 font-medium text-neutral-50">
              ?
            </span>
          )}
          <p className="text-15 font-semibold text-neutral-100">
            {getChainName(chainId)}
          </p>
        </div>
      </div>
    </>
  )
}

function ConnectContent({ approval }: { approval: PendingApproval }) {
  return (
    <>
      <AccountInfo address={approval.address} />
      <NetworkInfo chainId={approval.chainId} />
      <div className="flex flex-col gap-2 rounded-16 border border-neutral-10 bg-neutral-2.5 px-4 py-3">
        <p className="text-13 text-neutral-50">dApp will be able to:</p>
        <ul className="list-disc gap-0.5 pl-4 text-13 text-neutral-100 marker:text-neutral-40">
          <li>Check your account balance and activity</li>
          <li>Request transactions and message signing</li>
        </ul>
      </div>
    </>
  )
}

function SignContent({
  approval,
}: {
  approval: Extract<PendingApproval, { type: 'personal_sign' }>
}) {
  const readableMessage = hexToReadableMessage(approval.message)

  return (
    <>
      <p className="mb-2 text-13 font-medium text-neutral-50">Message</p>
      <div className="mb-4 overflow-y-auto rounded-16 border border-neutral-10 bg-neutral-2.5 px-4 py-3">
        <pre className="whitespace-pre-wrap break-words text-13 text-neutral-100">
          {readableMessage}
        </pre>
      </div>
      <AccountInfo address={approval.address} />
      <NetworkInfo chainId={approval.chainId} />
    </>
  )
}
