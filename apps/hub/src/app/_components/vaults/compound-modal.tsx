/* eslint-disable import/no-unresolved */
'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { InfoIcon } from '@status-im/icons/16'
import { CloseIcon } from '@status-im/icons/20'
import Image from 'next/image'

const img =
  'http://localhost:3845/assets/545aa67a6eecd0a49090b45f7d6a973e4872182a.svg'
const img1 =
  'http://localhost:3845/assets/43c3f8200f12a3f272bcfe34fd5a4fc09d6aaf18.svg'
const img2 =
  'http://localhost:3845/assets/eafc1691ee0ee47b7e6dd412dc2ba15302ee831e.svg'
const img3 =
  'http://localhost:3845/assets/7624c6c65a9f8dc84102de40794499658fa2d785.svg'

type Props = {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
  points?: number
  totalCompounded?: number
  earnRate?: number
  boost?: number
  equivalentRate?: number
  equivalentBoost?: number
}

const VaultCompoundModal = (props: Props) => {
  const {
    open,
    onClose,
    children,
    points = 124,
    totalCompounded = 123345,
    earnRate = 83,
    boost = 2.035,
    equivalentRate = 39,
    equivalentBoost = 0.0,
  } = props

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose()
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-80/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 px-4 focus:outline-none">
          <div
            className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-20 bg-white-100 shadow-3"
            data-name="Modal message"
            data-node-id="2863:20769"
          >
            {/* Close button */}
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="absolute right-3 top-3 z-50 flex size-8 items-center justify-center rounded-10 border border-[rgba(27,39,61,0.1)] backdrop-blur-[20px] transition-colors hover:bg-neutral-10 focus:outline-none"
                data-name="Button"
                data-node-id="2863:20775"
              >
                <CloseIcon className="text-neutral-100" />
              </button>
            </Dialog.Close>

            {/* Icon section */}
            <div
              className="box-border flex w-full flex-col items-center justify-center gap-[2px] px-4 py-8"
              data-name="Icon"
              data-node-id="2863:20770"
            >
              <div
                className="relative size-[50px] overflow-hidden"
                data-name="Icons 50"
                data-node-id="2863:20909"
              >
                <div
                  className="absolute inset-[66.61%_66.59%_10.42%_10.42%]"
                  data-name="Vector"
                  data-node-id="I2863:20909;2863:20882"
                >
                  <div
                    className="absolute inset-[-17.41%_-17.39%_-17.41%_-17.4%]"
                    style={
                      {
                        '--stroke-0': 'rgba(113, 64, 253, 1)',
                      } as React.CSSProperties
                    }
                  >
                    <Image
                      alt=""
                      className="block size-full max-w-none"
                      src={img}
                    />
                  </div>
                </div>
                <div
                  className="absolute inset-[8.33%_8.33%_37.5%_37.5%]"
                  data-name="Vector"
                  data-node-id="I2863:20909;2863:20883"
                >
                  <div
                    className="absolute inset-[-7.38%]"
                    style={
                      {
                        '--stroke-0': 'rgba(113, 64, 253, 1)',
                      } as React.CSSProperties
                    }
                  >
                    <Image
                      alt=""
                      className="block size-full max-w-none"
                      src={img1}
                    />
                  </div>
                </div>
                <div
                  className="absolute bottom-1/2 left-[16.67%] right-[54.17%] top-[31.33%]"
                  data-name="Vector"
                  data-node-id="I2863:20909;2863:20884"
                >
                  <div
                    className="absolute inset-[-21.43%_-13.72%_-21.43%_-13.71%]"
                    style={
                      {
                        '--stroke-0': 'rgba(113, 64, 253, 1)',
                      } as React.CSSProperties
                    }
                  >
                    <Image
                      alt=""
                      className="block size-full max-w-none"
                      src={img2}
                    />
                  </div>
                </div>
                <div
                  className="absolute bottom-[16.67%] left-1/2 right-[31.33%] top-[54.17%]"
                  data-name="Vector"
                  data-node-id="I2863:20909;2863:20885"
                >
                  <div
                    className="absolute inset-[-13.72%_-21.43%_-13.71%_-21.43%]"
                    style={
                      {
                        '--stroke-0': 'rgba(113, 64, 253, 1)',
                      } as React.CSSProperties
                    }
                  >
                    <Image
                      alt=""
                      className="block size-full max-w-none"
                      src={img3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Text Combinations */}
            <div
              className="box-border flex w-full flex-col gap-8 px-8 pb-8 pt-0"
              data-name="Text Combinations"
              data-node-id="2863:20772"
            >
              {/* Title */}
              <div
                className="flex w-full flex-col gap-1"
                data-name="Title"
                data-node-id="2863:20840"
              >
                <Dialog.Title asChild>
                  <div
                    className="flex w-full items-center gap-[6px]"
                    data-name="Standard Title"
                    data-node-id="2863:20773"
                  >
                    <p className="min-h-px min-w-px shrink-0 grow basis-0 text-center text-[19px] font-semibold leading-[1.35] tracking-[-0.304px] text-[#09101c]">
                      Ready to compound {points} points
                    </p>
                  </div>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <div
                    className="flex w-full flex-col justify-center text-center text-[15px] leading-[0] tracking-[-0.135px] text-[#09101c]"
                    data-node-id="2863:20774"
                  >
                    <p className="leading-[1.45]">
                      Please sign the message in your wallet.
                    </p>
                  </div>
                </Dialog.Description>
              </div>

              {/* Stats */}
              <div
                className="box-border flex w-full flex-col gap-[27px] overflow-hidden rounded-16 bg-[#fafbfc] px-0 py-4"
                data-name="Stats"
                data-node-id="2863:20839"
              >
                {/* Total compounded */}
                <div
                  className="flex w-full flex-col items-center gap-2 text-center leading-[0]"
                  data-name="Content"
                  data-node-id="2863:20836"
                >
                  <div
                    className="flex w-full flex-col justify-center text-[13px] font-medium tracking-[-0.039px] text-[#647084]"
                    data-node-id="2863:20818"
                  >
                    <p className="leading-[1.4]">Total compounded</p>
                  </div>
                  <div
                    className="flex w-full flex-col justify-center text-[27px] font-semibold tracking-[-0.567px] text-[#09101c]"
                    data-node-id="2863:20819"
                  >
                    <p className="leading-[32px]">
                      {totalCompounded.toLocaleString()} points
                    </p>
                  </div>
                </div>

                {/* Your earn rate */}
                <div
                  className="flex w-full flex-col items-center gap-2 text-center leading-[0]"
                  data-name="Content"
                  data-node-id="2863:20837"
                >
                  <div
                    className="flex w-full flex-col justify-center text-[13px] font-medium tracking-[-0.039px] text-[#647084]"
                    data-node-id="2863:20821"
                  >
                    <p className="leading-[1.4]">
                      Your earn rate at x{boost} boost
                    </p>
                  </div>
                  <div
                    className="flex w-full flex-col justify-center text-[27px] font-semibold tracking-[-0.567px] text-[#09101c]"
                    data-node-id="2863:20820"
                  >
                    <p className="leading-[32px]">{earnRate} Karma / day</p>
                  </div>
                </div>

                {/* Equivalent */}
                <div
                  className="flex w-full flex-col items-center gap-2 text-center leading-[0]"
                  data-name="Content"
                  data-node-id="2863:20838"
                >
                  <div
                    className="flex w-full flex-col justify-center text-[13px] font-medium tracking-[-0.039px] text-[#647084]"
                    data-node-id="2863:20823"
                  >
                    <p className="leading-[1.4]">
                      Equivalent at x{equivalentBoost.toFixed(2)} boost
                    </p>
                  </div>
                  <div
                    className="flex w-full flex-col justify-center text-[27px] font-semibold tracking-[-0.567px] text-[#09101c]"
                    data-node-id="2863:20825"
                  >
                    <p className="leading-[32px]">
                      {equivalentRate} Karma / day
                    </p>
                  </div>
                </div>
              </div>

              {/* Information Box */}
              <div
                className="box-border flex w-full items-start gap-2 rounded-12 border border-solid border-[rgba(42,74,245,0.1)] bg-[rgba(42,74,245,0.05)] px-4 py-[11px]"
                data-name="Information Box"
                data-node-id="2863:20841"
              >
                <div
                  className="box-border flex items-start justify-center gap-[10px] self-stretch px-0 py-px"
                  data-name="Icon"
                  data-node-id="I2863:20841;12465:139636"
                >
                  <div
                    className="relative size-4 overflow-hidden"
                    data-name="16/info"
                    data-node-id="I2863:20841;12465:139637"
                  >
                    <InfoIcon />
                  </div>
                </div>
                <div
                  className="flex min-h-px min-w-px shrink-0 grow basis-0 flex-col justify-center text-[13px] leading-[0] tracking-[-0.039px] text-[#09101c]"
                  data-node-id="I2863:20841;2950:44190"
                >
                  <p className="leading-[1.4]">
                    Boost the rate at which you receive Karma. More points you
                    compound, the higher your rate. The longer you lock your
                    vault, the higher your boost, and the faster you accumulate
                    Karma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { VaultCompoundModal }
