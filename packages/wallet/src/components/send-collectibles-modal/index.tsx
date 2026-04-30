'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { Avatar, Button, useToast } from '@status-im/components'
import { CloseIcon, ExternalIcon } from '@status-im/icons/20'

import { AddressField } from './address-field'
import { AmountField } from './amount-field'
import { BottomBar } from './bottom-bar'
import {
  createNftSendSchema,
  encodeNftTransfer,
  getNftSendErrorMessage,
} from './nft-helpers'

import type { NetworkType } from '../../data'
import type { GasFees } from './nft-helpers'
import type React from 'react'

const MODAL_MAX_HEIGHT = 824

export type SendCollectibleParams = {
  to: string
  contractAddress: string
  tokenId: string
  standard: string
  amount?: string
  encodedData: string
  gasLimit: string
  maxFeePerGas: string
  maxInclusionFeePerGas: string
}

type Props = {
  children: React.ReactNode
  standard: string
  displayName: string
  collectibleImage?: string
  fromAddress: string
  accountName: string
  network: NetworkType
  contract: string
  tokenId: string
  /** ERC-1155 token balance held by the sender */
  balance?: bigint
  /** Gas fee data provided by the parent */
  gasFees?: GasFees
  isFetchingFees?: boolean
  /** Called with (to, amount) when the form changes — parent debounces and fetches fees */
  onEstimateGas: (to: string, amount?: string) => void
  /** ETH balance for gas affordability check */
  ethBalance: number
  /** Called when the user confirms the send */
  onSend: (params: SendCollectibleParams) => Promise<void>
  /** Called after a successful send so the parent can invalidate queries */
  onSuccess?: () => void
  hasActiveSession: boolean
  requestPassword: (options?: {
    title?: string
    description?: string
    buttonLabel?: string
  }) => Promise<boolean>
}

const SendCollectiblesModal = (props: Props) => {
  const {
    children,
    standard,
    displayName,
    collectibleImage,
    fromAddress,
    accountName,
    network,
    contract,
    tokenId,
    balance,
    gasFees,
    isFetchingFees = false,
    onEstimateGas,
    ethBalance,
    onSend,
    onSuccess,
    hasActiveSession,
    requestPassword,
  } = props

  const [open, setOpen] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [addressTouched, setAddressTouched] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const gasTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toast = useToast()

  const isErc1155 = standard === 'ERC1155'
  const effectiveAmount = isErc1155 ? amount : '1'

  const formSchema = useMemo(
    () => createNftSendSchema({ fromAddress, isErc1155, balance }),
    [fromAddress, isErc1155, balance],
  )
  const parseResult = formSchema.safeParse({
    to: recipientAddress,
    amount: effectiveAmount,
  })
  const fieldErrors = parseResult.success
    ? {}
    : parseResult.error.flatten().fieldErrors
  const addressErrorMessage = fieldErrors.to?.[0] ?? null
  const amountErrorMessage = fieldErrors.amount?.[0] ?? null
  const isAddressValid = !addressErrorMessage && recipientAddress.length > 0
  const isValidAmount = !amountErrorMessage
  const isOverBalance = amountErrorMessage === 'More than available balance'
  const isFractionalAmount =
    amountErrorMessage === "Can't send fraction of collectible"
  const showAddressError =
    addressTouched &&
    recipientAddress.length > 0 &&
    addressErrorMessage !== null

  const hasInsufficientEth =
    isAddressValid && !!gasFees && ethBalance < gasFees.maxFeeEth

  // Debounce gas estimation trigger on form changes
  useEffect(() => {
    if (!open || !isValidAmount) return

    const effectiveTo = isAddressValid ? recipientAddress : fromAddress

    if (gasTimerRef.current) clearTimeout(gasTimerRef.current)
    gasTimerRef.current = setTimeout(() => {
      onEstimateGas(effectiveTo, isErc1155 ? effectiveAmount : undefined)
    }, 500)

    return () => {
      if (gasTimerRef.current) clearTimeout(gasTimerRef.current)
    }
  }, [
    open,
    recipientAddress,
    effectiveAmount,
    isAddressValid,
    isValidAmount,
    isErc1155,
    fromAddress,
    onEstimateGas,
  ])

  const resetState = () => {
    setRecipientAddress('')
    setAmount('')
    setAddressTouched(false)
    setIsSending(false)
    if (gasTimerRef.current) clearTimeout(gasTimerRef.current)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetState()
    setOpen(nextOpen)
  }

  const handleSend = async () => {
    setAddressTouched(true)
    if (!isAddressValid || !isValidAmount || isOverBalance || !gasFees) return

    setIsSending(true)

    try {
      if (!hasActiveSession) {
        const unlocked = await requestPassword({
          title: 'Enter password',
          description: 'To send NFT',
          buttonLabel: 'Send NFT',
        })
        if (!unlocked) return
      }

      const encodedData = encodeNftTransfer({
        standard,
        from: fromAddress,
        to: recipientAddress,
        tokenId,
        amount: isErc1155 ? effectiveAmount : undefined,
      })

      await onSend({
        to: recipientAddress,
        contractAddress: contract,
        tokenId,
        standard,
        amount: isErc1155 ? effectiveAmount : undefined,
        encodedData,
        gasLimit: gasFees.txParams.gasLimit,
        maxFeePerGas: gasFees.txParams.maxFeePerGas,
        maxInclusionFeePerGas: gasFees.txParams.maxPriorityFeePerGas,
      })

      onSuccess?.()
      toast.positive('NFT transfer submitted')
      handleOpenChange(false)
    } catch (error: unknown) {
      toast.negative(getNftSendErrorMessage(error))
    } finally {
      setIsSending(false)
    }
  }

  const canSubmit =
    isAddressValid &&
    isValidAmount &&
    !isOverBalance &&
    !!gasFees &&
    !hasInsufficientEth &&
    !isSending

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blur-neutral-100/70 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in" />
        <Dialog.Content
          data-customisation="blue"
          className="fixed left-0 top-[38px] flex size-full justify-center"
        >
          <div
            className="shadow fixed z-auto flex h-[calc(100vh-76px)] w-[calc(100%-23px)] max-w-[494px] flex-col overflow-hidden rounded-16 bg-white-100 transition data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in"
            style={{ maxHeight: `${MODAL_MAX_HEIGHT}px` }}
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between px-4 pb-1 pt-4">
              <Dialog.Title className="text-27 font-semibold text-neutral-100">
                Send collectible
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Send {displayName} to another wallet
              </Dialog.Description>
              <Dialog.Close asChild>
                <Button
                  icon={<CloseIcon />}
                  aria-label="Close"
                  variant="outline"
                  size="32"
                />
              </Dialog.Close>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-auto">
              <div className="flex flex-col gap-2 pt-6">
                <AddressField
                  value={recipientAddress}
                  onChange={val => {
                    setRecipientAddress(val)
                    setAddressTouched(true)
                  }}
                  showError={showAddressError}
                  errorMessage={addressErrorMessage ?? ''}
                />

                <AmountField
                  isErc1155={isErc1155}
                  amount={amount}
                  onAmountChange={setAmount}
                  displayName={displayName}
                  collectibleImage={collectibleImage}
                  network={network}
                  isFractionalAmount={isFractionalAmount}
                  balance={balance}
                />

                {/* From */}
                <div className="px-5 pb-4">
                  <p className="mb-2 text-13 font-medium text-neutral-50">
                    From
                  </p>
                  <div
                    className="flex items-center gap-2 rounded-16 border border-neutral-10 px-3 py-2"
                    data-customisation="magenta"
                  >
                    <Avatar
                      type="account"
                      name={accountName}
                      emoji="🍑"
                      size="32"
                      bgOpacity="20"
                    />
                    <div>
                      <div className="text-15 font-semibold text-neutral-100">
                        {accountName}
                      </div>
                      <span className="font-mono text-13 text-neutral-50">
                        {fromAddress.slice(0, 6)}...{fromAddress.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contract address */}
                <div className="px-5 pb-4">
                  <p className="mb-2 text-13 font-medium text-neutral-50">
                    Contract address
                  </p>
                  <div className="flex items-center gap-4 rounded-16 border border-neutral-10 py-2 pl-4 pr-3">
                    <span className="flex-1 truncate font-mono text-13 text-neutral-100">
                      {contract}
                    </span>
                    <a
                      href={`https://etherscan.io/token/${contract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View contract on Etherscan"
                      className="shrink-0 text-neutral-50 hover:text-neutral-60"
                    >
                      <ExternalIcon />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <BottomBar
              gasFeeData={gasFees}
              isFetchingFees={isFetchingFees}
              hasInsufficientEth={hasInsufficientEth}
              network={network}
              fromAddress={fromAddress}
              canSubmit={canSubmit}
              isSending={isSending}
              onSend={handleSend}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { SendCollectiblesModal }
export type { GasFees as CollectibleGasFees }
export { encodeNftTransfer, isSupportedNftStandard } from './nft-helpers'
