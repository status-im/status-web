'use client'

import { useCallback } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { InfoIcon } from '@status-im/icons/12'
import { Button } from '@status-im/status-network/components'
import { useAccount } from 'wagmi'

import { useVaultWithdraw } from '~hooks/useVaultWithdraw'

import { BaseVaultModal } from './base-vault-modal'

import type { Address } from 'viem'

interface WithdrawVaultModalProps {
  onClose: () => void
  vaultAddress: Address
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

/**
 * Modal for emergency withdrawal from vault
 */
export function WithdrawVaultModal(props: WithdrawVaultModalProps) {
  const { onClose, vaultAddress, open, onOpenChange, children } = props

  const { address } = useAccount()
  const { mutate: withdraw } = useVaultWithdraw()

  const handleVaultWithdrawal = useCallback(() => {
    const amountWei = 1000000000000000000n

    if (!address) {
      console.error('No address found - wallet not connected')
      return
    }

    try {
      withdraw({
        amountWei,
        vaultAddress,
        onSigned: () => {
          onClose()
        },
      })
    } catch (error) {
      console.error('Error calling withdraw:', error)
    }
  }, [address, onClose, vaultAddress, withdraw])

  return (
    <BaseVaultModal
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
      title="Emergency withdrawal"
      description="In the event of a hack or contract compromise, you can use this feature to immediately withdraw your funds from the vault."
      trigger={children}
    >
      <div className="box-border flex w-full flex-col items-center justify-center gap-1 p-4">
        <div className="flex w-full items-start gap-[2px]">
          <div className="flex shrink-0 grow basis-0 flex-col items-start gap-2">
            <div className="flex w-full items-start">
              <p className="shrink-0 grow basis-0 text-13 font-medium text-neutral-50">
                Withdraw to
              </p>
            </div>
            <div className="w-full rounded-12 border border-neutral-10 bg-white-100 opacity-[0.4]">
              <div className="box-border flex w-full items-center gap-2 overflow-hidden rounded-[inherit] py-[9px] pl-4 pr-3">
                <p className="shrink-0 grow basis-0 break-words text-15 text-neutral-100">
                  {address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="box-border flex w-full flex-col items-start gap-2 p-4">
        <div className="box-border flex w-full flex-col items-start gap-2 rounded-12 border border-customisation-blue-50/10 bg-customisation-blue-50/5 px-4 pb-3 pt-[10px]">
          <div className="flex w-full items-start gap-2">
            <div className="box-border flex items-start justify-center gap-[10px] self-stretch px-0 pb-0 pt-[3px]">
              <div className="relative size-3 overflow-hidden">
                <InfoIcon />
              </div>
            </div>
            <div className="flex shrink-0 grow basis-0 flex-col items-start gap-2">
              <div className="flex w-full flex-col justify-center text-13 text-neutral-100">
                <p>Your funds will sent directly to your connected wallet.</p>
              </div>
              <Button
                variant="outline"
                size="32"
                className="rounded-8 px-2 py-[3px] pr-[6px] text-13"
              >
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start">
        <div className="box-border flex w-full items-center justify-center gap-3 px-4 pb-4 pt-6">
          <Dialog.Close asChild>
            <Button
              size="40"
              variant="outline"
              onClick={onClose}
              className="flex-1 justify-center"
            >
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            size="40"
            variant="primary"
            type="button"
            onClick={() => handleVaultWithdrawal()}
            className="flex-1 justify-center"
          >
            Withdraw funds
          </Button>
        </div>
      </div>
    </BaseVaultModal>
  )
}
