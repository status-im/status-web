import { useEffect, useState } from 'react'

import { Button } from '@status-im/components'
import { CloseIcon } from '@status-im/icons/20'

import {
  getPendingApproval,
  type PendingApproval,
  setApprovalResult,
} from '../../lib/approval'

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

  useEffect(() => {
    getPendingApproval().then(setApproval)
  }, [])

  const respond = async (approved: boolean) => {
    if (!approval || isSubmitting) return
    setIsSubmitting(true)
    await setApprovalResult({
      id: approval.id,
      approved,
      ...(approved && isSign && password ? { password } : {}),
    })
    window.close()
  }

  if (!approval) {
    return null
  }

  const isSign = approval.type === 'personal_sign'

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
        <SignContent
          approval={approval}
          password={password}
          onPasswordChange={setPassword}
        />
      ) : (
        <ConnectContent approval={approval} />
      )}

      <div className="grid grid-cols-2 gap-3 py-3">
        <Button
          variant="outline"
          onPress={() => respond(false)}
          disabled={isSubmitting}
        >
          Decline
        </Button>
        <Button
          variant="primary"
          onPress={() => respond(true)}
          disabled={isSubmitting || (isSign && !password)}
        >
          {isSign ? 'Sign' : 'Connect'}
        </Button>
      </div>
    </div>
  )
}

function ConnectContent({ approval }: { approval: PendingApproval }) {
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
              {truncateAddress(approval.address)}
            </p>
          </div>
        </div>
      </div>

      <p className="mb-2 text-13 font-medium text-neutral-50">Network</p>
      <div className="mb-4 rounded-16 border border-neutral-10 p-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#627EEA]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-white-100"
            >
              <path
                d="M8 2L4 8.5L8 6.5L12 8.5L8 2Z"
                fill="currentColor"
                opacity="0.6"
              />
              <path d="M8 6.5L4 8.5L8 11L12 8.5L8 6.5Z" fill="currentColor" />
              <path
                d="M4 9.2L8 14L12 9.2L8 11.7L4 9.2Z"
                fill="currentColor"
                opacity="0.6"
              />
            </svg>
          </span>
          <p className="text-15 font-semibold text-neutral-100">
            {getChainName(approval.chainId)}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-16 border border-neutral-10 bg-neutral-2.5 px-4 py-3">
        <p className="text-13 text-neutral-50">dApp will be able to:</p>
        <ul className="gap-0.5 text-13 text-neutral-100">
          <li className="flex items-start gap-2">
            Check your account balance and activity
          </li>
          <li className="flex items-start gap-2">
            Request transactions and message signing
          </li>
        </ul>
      </div>
    </>
  )
}

function SignContent({
  approval,
  password,
  onPasswordChange,
}: {
  approval: Extract<PendingApproval, { type: 'personal_sign' }>
  password: string
  onPasswordChange: (value: string) => void
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

      <p className="mb-2 text-13 font-medium text-neutral-50">Password</p>
      <input
        type="password"
        value={password}
        onChange={e => onPasswordChange(e.target.value)}
        placeholder="Enter wallet password"
        className="mb-auto h-10 rounded-12 border border-neutral-20 bg-white-100 px-3 text-15 text-neutral-100 outline-none placeholder:text-neutral-40 focus:border-customisation-50"
      />
    </>
  )
}
