import { useEffect, useMemo, useRef, useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { Avatar, Button, useToast } from '@status-im/components'
import { CloseIcon, ExternalIcon } from '@status-im/icons/20'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useEthBalance } from '@/hooks/use-eth-balance'
import { apiClient } from '@/providers/api-client'
import { usePassword } from '@/providers/password-context'
import { usePendingTransactions } from '@/providers/pending-transactions-context'

import {
  createNftSendSchema,
  encodeNftTransfer,
  extractTxHash,
  fetchErc1155Balance,
  fetchNftGasFees,
  getNftSendErrorMessage,
} from './nft-helpers'
import { AddressField } from './send-collectible-modal/address-field'
import { AmountField } from './send-collectible-modal/amount-field'
import { BottomBar } from './send-collectible-modal/bottom-bar'

import type { GasFees } from '../../assets/-components/token-helpers'
import type { NetworkType } from '@status-im/wallet/data'
import type React from 'react'

const MODAL_MAX_HEIGHT = 824

type Props = {
  children: React.ReactNode
  standard: string
  displayName: string
  collectibleImage?: string
  fromAddress: string
  walletId: string
  accountName: string
  network: NetworkType
  contract: string
  tokenId: string
  /** ERC-1155 token balance held by the sender. When provided, enables balance display and validation. */
  balance?: bigint
}

const SendCollectibleModal = (props: Props) => {
  const {
    children,
    standard,
    displayName,
    collectibleImage,
    fromAddress,
    walletId,
    accountName,
    network,
    contract,
    tokenId,
    balance: balanceProp,
  } = props

  const [open, setOpen] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [addressTouched, setAddressTouched] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [gasInput, setGasInput] = useState<{
    to: string
    amount: string
  } | null>(null)
  const gasTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toast = useToast()
  const queryClient = useQueryClient()
  const { hasActiveSession, requestPassword } = usePassword()
  const { addPendingTransaction } = usePendingTransactions()

  const isErc1155 = standard === 'ERC1155'

  const contractKey = contract.toLowerCase()
  const fromAddressKey = fromAddress.toLowerCase()
  const gasToKey = gasInput?.to.toLowerCase()

  const balanceQuery = useQuery({
    queryKey: [
      'erc1155-balance',
      network,
      contractKey,
      tokenId,
      fromAddressKey,
    ],
    queryFn: () =>
      fetchErc1155Balance({
        owner: fromAddress,
        contract,
        tokenId,
        network,
      }),
    enabled: open && isErc1155,
    staleTime: 15 * 1000,
  })
  const balance = balanceProp ?? balanceQuery.data

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

  const gasFeeQuery = useQuery<GasFees>({
    queryKey: [
      'nft-gas-fees',
      fromAddressKey,
      gasToKey,
      gasInput?.amount,
      contractKey,
      tokenId,
      standard,
    ],
    queryFn: async () => {
      return fetchNftGasFees({
        from: fromAddress,
        to: gasInput!.to,
        contractAddress: contract,
        tokenId,
        standard,
        network,
        amount: isErc1155 ? gasInput?.amount : undefined,
      })
    },
    enabled: !!gasInput,
  })

  const ethBalanceQuery = useEthBalance(fromAddress, open)
  const ethBalance = ethBalanceQuery.data?.summary.total_balance ?? 0
  const hasInsufficientEth =
    isAddressValid &&
    !!gasFeeQuery.data &&
    ethBalance < gasFeeQuery.data.maxFeeEth

  // Debounce gas fetching on recipient/amount changes. Uses sender as a
  // dummy recipient while the real address is still invalid so fees stay
  // visible at all times.
  useEffect(() => {
    if (!open || !isValidAmount) return

    const effectiveTo = isAddressValid ? recipientAddress : fromAddress

    if (gasTimerRef.current) clearTimeout(gasTimerRef.current)
    gasTimerRef.current = setTimeout(() => {
      setGasInput({ to: effectiveTo, amount: effectiveAmount })
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
    fromAddress,
  ])

  const resetState = () => {
    setRecipientAddress('')
    setAmount('')
    setAddressTouched(false)
    setIsSending(false)
    setGasInput(null)
    if (gasTimerRef.current) clearTimeout(gasTimerRef.current)
    queryClient.cancelQueries({ queryKey: ['nft-gas-fees'] })
    queryClient.cancelQueries({ queryKey: ['erc1155-balance'] })
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetState()
    setOpen(nextOpen)
  }

  const handleSend = async () => {
    setAddressTouched(true)
    if (!isAddressValid || !isValidAmount || isOverBalance || !gasFeeQuery.data)
      return

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

      const data = encodeNftTransfer({
        standard,
        from: fromAddress,
        to: recipientAddress,
        tokenId,
        amount: isErc1155 ? effectiveAmount : undefined,
      })

      const result =
        await apiClient.wallet.account.ethereum.sendContractCall.mutate({
          walletId,
          fromAddress,
          toAddress: contract,
          gasLimit: gasFeeQuery.data.txParams.gasLimit,
          maxFeePerGas: gasFeeQuery.data.txParams.maxFeePerGas,
          maxInclusionFeePerGas: gasFeeQuery.data.txParams.maxPriorityFeePerGas,
          data,
          value: '0',
        })

      const txid = result.id?.txid
      if (!txid) throw new Error('Failed to send NFT')

      if (
        typeof txid === 'object' &&
        'error' in txid &&
        typeof txid.error === 'string'
      ) {
        throw new Error(txid.error)
      }

      const txHash = extractTxHash(txid)
      if (!txHash) throw new Error('Transaction hash not found')

      addPendingTransaction({
        hash: txHash,
        from: fromAddress,
        to: recipientAddress,
        value: 0,
        asset: displayName,
        network,
        status: 'pending',
        category: 'external',
        blockNum: '0',
        metadata: { blockTimestamp: new Date().toISOString() },
        rawContract: { value: '0', address: contract, decimal: '0' },
        eurRate: 0,
      })

      queryClient.invalidateQueries({ queryKey: ['collectibles'] })
      queryClient.invalidateQueries({
        queryKey: ['collectible', network, contract, tokenId],
      })
      if (isErc1155) {
        queryClient.invalidateQueries({
          queryKey: [
            'erc1155-balance',
            network,
            contractKey,
            tokenId,
            fromAddressKey,
          ],
        })
      }

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
    !!gasFeeQuery.data &&
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
            {/* Header — pt-16 pb-4 = 52px total matches Figma */}
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
            {/* Scrollable body — pt-24 matches Figma body top-[76px] - header-[52px] = 24px gap */}
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
              </div>{' '}
              {/* end gap-2 pt-6 wrapper */}
            </div>{' '}
            {/* end overflow-auto */}
            <BottomBar
              gasFeeData={gasFeeQuery.data}
              isFetchingFees={gasFeeQuery.isFetching}
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

export { SendCollectibleModal }
