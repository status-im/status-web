/* eslint-disable import/no-unresolved */
'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { InfoIcon } from '@status-im/icons/12'
import { CloseIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'

import { SNT_TOKEN } from '../../../config'
import { vaultAbi } from '../../contracts'

import type { Address } from 'viem'

type Props = {
  onClose: () => void
  vaultAdress: Address
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const VaultWithdrawModal = (props: Props) => {
  const { onClose, vaultAdress, open, onOpenChange, children } = props

  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  const { data: availableWithdraw } = useReadContract({
    abi: vaultAbi,
    address: vaultAdress,
    functionName: 'availableWithdraw',
    args: [SNT_TOKEN.address],
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(nextOpen)
    }
    if (!nextOpen) {
      onClose()
    }
  }

  const handleVaultWithdrawal = () => {
    writeContract({
      abi: vaultAbi,
      address: vaultAdress,
      functionName: 'unstake',
      args: [availableWithdraw || 0n],
    })
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-80/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 px-4 focus:outline-none">
          <div className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-20 bg-white-100 shadow-3">
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="absolute right-3 top-3 z-50 flex size-8 items-center justify-center rounded-10 border border-[rgba(27,39,61,0.1)] backdrop-blur-[20px] transition-colors hover:bg-neutral-10 focus:outline-none"
              >
                <CloseIcon className="text-neutral-100" />
              </button>
            </Dialog.Close>

            <div className="flex w-full flex-col items-start">
              <div className="box-border flex w-full flex-col items-center px-0 py-1">
                <div className="box-border flex w-full flex-col items-start gap-1 px-4 py-3">
                  <Dialog.Title asChild>
                    <div className="flex w-full items-center gap-[6px]">
                      <p className="min-h-px min-w-px shrink-0 grow basis-0 text-[19px] font-semibold leading-[1.35] tracking-[-0.304px] text-neutral-100">
                        Emergency withdrawal
                      </p>
                    </div>
                  </Dialog.Title>
                  <Dialog.Description asChild>
                    <div className="flex w-full flex-col justify-center text-[15px] leading-[0] tracking-[-0.135px] text-neutral-100">
                      <p className="leading-[1.45]">
                        In the event of a hack or contract compromise, you can
                        use this feature to immediately withdraw your funds from
                        the vault.
                      </p>
                    </div>
                  </Dialog.Description>
                </div>
              </div>
            </div>

            <div className="box-border flex w-full flex-col items-center justify-center gap-1 p-4">
              <div className="flex w-full items-start gap-[2px]">
                <div className="flex min-h-px min-w-px shrink-0 grow basis-0 flex-col items-start gap-2">
                  <div className="flex w-full items-start">
                    <p className="min-h-px min-w-px shrink-0 grow basis-0 text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-neutral-50">
                      Withdraw to
                    </p>
                  </div>
                  <div className="w-full rounded-12 border border-solid border-neutral-20 bg-white-100">
                    <div className="box-border flex w-full items-center gap-2 overflow-hidden rounded-8 py-[9px] pl-4 pr-3">
                      <p className="min-h-px min-w-px shrink-0 grow basis-0 text-[15px] leading-[1.45] tracking-[-0.135px] text-neutral-100">
                        {address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="box-border flex w-full flex-col items-start gap-2 p-4">
              <div className="box-border flex w-full flex-col items-start gap-2 rounded-12 border border-solid border-[rgba(42,74,245,0.1)] bg-[rgba(42,74,245,0.05)] px-4 pb-3 pt-[10px]">
                <div className="flex w-full items-start gap-2">
                  <div className="box-border flex items-start justify-center gap-[10px] self-stretch px-0 pb-0 pt-[3px]">
                    <div className="relative size-3 overflow-hidden">
                      <InfoIcon />
                    </div>
                  </div>
                  <div className="flex min-h-px min-w-px shrink-0 grow basis-0 flex-col items-start gap-2">
                    <div className="flex min-w-full flex-col justify-center text-[13px] leading-[0] tracking-[-0.039px] text-[#09101c]">
                      <p className="leading-[1.4]">
                        Your funds will sent directly to your connected wallet.
                      </p>
                    </div>
                    {/* @ts-expect-error - Button component is not typed */}
                    <Button
                      variant="outline"
                      size="24"
                      className="rounded-8 px-3 text-[13px]"
                    >
                      Learn more
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-start bg-[rgba(255,255,255,0.7)] backdrop-blur-[20px]">
              <div className="box-border flex w-full items-center justify-center gap-3 px-4 pb-4 pt-6">
                {/* @ts-expect-error - Button component is not typed */}
                <Button
                  size="40"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 justify-center"
                >
                  Cancel
                </Button>
                {/* @ts-expect-error - Button component is not typed */}
                <Button
                  size="40"
                  variant="primary"
                  onClick={handleVaultWithdrawal}
                  className="flex-1 justify-center"
                >
                  Withdraw funds
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { VaultWithdrawModal }
