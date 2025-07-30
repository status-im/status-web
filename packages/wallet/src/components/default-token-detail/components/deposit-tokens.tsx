'use client'
import { useEffect, useState } from 'react'

import { IconButton } from '@status-im/components'
import { CheckIcon, CopyIcon } from '@status-im/icons/20'
import { QRCodeSVG } from 'qrcode.react'

import { useCopyToClipboard } from '../../../hooks'
import { NetworkLogo } from '../../network-logo'

type Props = {
  address: string
}

const DepositTokens = (props: Props) => {
  const { address } = props
  const [, copy] = useCopyToClipboard()
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setTimeout(() => setSuccess(false), 2000)
  }, [success])

  const handleCopy = () => {
    console.log('copying address', address)
    console.log('success', success)
    copy(address)
    setSuccess(true)
  }

  return (
    <div className="flex flex-col gap-4 rounded-16 bg-white-100 p-4">
      <div className="flex flex-col gap-1">
        <span className="text-19 font-600 text-neutral-100">
          Deposit tokens
        </span>
        <p className="text-15 font-400 text-neutral-100">
          Send ETH, tokens or collectibles (NFTs) to this address from another
          wallet or exchange
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 text-neutral-50">
        <div className="flex items-center justify-center gap-4">
          <p className="font-mono text-15 font-500 text-neutral-50">
            {address}
          </p>
          <IconButton
            variant="outline"
            onPress={handleCopy}
            icon={
              success ? (
                <CheckIcon className="text-success-50" />
              ) : (
                <CopyIcon className="text-neutral-50" />
              )
            }
            aria-label="Copy code"
          />
        </div>

        <div className="flex size-[200px] flex-col items-center justify-center gap-3 rounded-16 bg-customisation-orange-50/5 p-3">
          <div className="flex items-center justify-center rounded-[14px] bg-white-100 p-[14px] shadow-3">
            <QRCodeSVG value={address} size={148} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-13 font-500 text-neutral-100">
            Supported network:
          </span>
          <span className="flex h-6 items-center gap-1 rounded-8 border border-neutral-30 bg-white-100 px-2 py-1 text-13 font-500 text-neutral-100">
            <NetworkLogo name="ethereum" size={12} />
            Ethereum
          </span>
        </div>
      </div>
    </div>
  )
}

export { DepositTokens }
