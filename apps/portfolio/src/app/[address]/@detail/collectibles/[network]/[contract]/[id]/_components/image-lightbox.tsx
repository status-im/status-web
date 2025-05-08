/* eslint-disable @next/next/no-img-element */
'use client'

import * as Dialog from '@radix-ui/react-dialog'
import * as Popover from '@radix-ui/react-popover'
import { useToast } from '@status-im/components'
import {
  CloseIcon,
  CopyIcon,
  DownloadIcon,
  ExternalIcon,
  OptionsIcon,
  SaveIcon,
} from '@status-im/icons/20'
import { OpenseaIcon } from '@status-im/icons/social'

import { Link } from '../../../../../../../_components/link'

async function fetchImage(value: string) {
  try {
    const response = await fetch(value)
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`)

    const blob = await response.blob()

    const dataUrl = await new Promise<string>(resolve => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
    // Create a function to revoke the data URL when it's no longer needed
    const revoke = () => {
      if (dataUrl.startsWith('blob:')) {
        URL.revokeObjectURL(dataUrl)
      }
    }

    return { url: dataUrl, blob, revoke }
  } catch (error) {
    console.error('Error fetching image:', error)
    throw new Error('Failed to fetch image')
  }
}

type Props = {
  thumbnailSrc: string
  fullSizeSrc: string
  name: string
  openSeaUrl?: string
  // etherscanUrl?: string
}

export function ImageLightbox({
  thumbnailSrc,
  fullSizeSrc,
  name,
  openSeaUrl,
  // etherscanUrl,
}: Props) {
  const toast = useToast()

  const handleSaveImage = async () => {
    try {
      const { url, revoke } = await fetchImage(fullSizeSrc)

      // Create a link element without adding it to the DOM
      const link = document.createElement('a')
      link.href = url
      link.download = name || 'image'
      link.rel = 'noopener noreferrer'

      // Modern approach that doesn't require appending to DOM
      link.click()

      // Clean up by revoking the object URL if it's a blob URL
      revoke()

      toast.positive('Image saved successfully')
    } catch (error) {
      console.error('Error saving image:', error)
      toast.negative('Error saving image')
    }
  }

  const handleCopyImage = async () => {
    try {
      const { blob, revoke } = await fetchImage(fullSizeSrc)

      if (navigator.clipboard && navigator.clipboard.write) {
        const item = new ClipboardItem({
          [blob.type]: blob,
        })

        await navigator.clipboard.write([item])

        // Clean up by revoking the object URL if it's a blob URL
        revoke()
        toast.positive('Image copied successfully')
      } else {
        toast.negative("Your browser doesn't support copying images")
      }
    } catch (error) {
      console.error('Error copying image:', error)
      toast.negative('Error copying image to clipboard')
    }
  }

  return (
    <Dialog.Root>
      <div className="relative mt-11 2xl:mt-0">
        <Dialog.Trigger asChild>
          <button className="aspect-square size-[110px] overflow-hidden rounded-16 2xl:size-[140px]">
            <img
              src={thumbnailSrc}
              alt={name}
              className="h-auto object-cover transition-transform hover:scale-105"
            />
          </button>
        </Dialog.Trigger>
        <div className="absolute right-2 top-2 z-50">
          <button
            className="flex size-6 items-center justify-center rounded-8 bg-white-40 p-[6px] backdrop-blur-[20px] transition-colors hover:bg-white-50"
            onClick={handleSaveImage}
          >
            <DownloadIcon className="size-4" />
          </button>
        </div>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 bg-blur-neutral-100/70 backdrop-blur-[20px]" />
        <Dialog.Content className="fixed inset-0 z-20 w-fit p-1">
          <Dialog.Title className="hidden">{name}</Dialog.Title>

          <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="rounded-10 border border-white-10 p-[6px] transition-colors hover:border-white-20">
                  <OptionsIcon className="text-white-100" />
                </button>
              </Popover.Trigger>
              <Popover.Content
                className="w-64 rounded-10 border border-white-10 bg-white-5 p-1 backdrop-blur-[20px]"
                sideOffset={5}
                align="end"
              >
                <div className="flex flex-col py-1">
                  <button
                    onClick={handleSaveImage}
                    className="flex items-center gap-2 rounded-10 px-2 py-[5px] text-15 font-500 text-white-100 transition-colors hover:bg-white-5"
                  >
                    <SaveIcon className="text-blur-white/70" />
                    Save image
                  </button>
                  <button
                    onClick={handleCopyImage}
                    className="flex items-center gap-2 rounded-10 px-2 py-[5px] text-15 font-500 text-white-100 transition-colors hover:bg-white-5"
                  >
                    <CopyIcon className="text-blur-white/70" />
                    Copy image
                  </button>
                  {openSeaUrl && (
                    <Link
                      href={openSeaUrl}
                      className="flex items-center gap-2 rounded-10 px-2 py-[5px] text-15 font-500 text-white-100 transition-colors hover:bg-white-5"
                    >
                      <div className="flex items-center justify-center">
                        <OpenseaIcon className="text-social-opensea" />
                      </div>
                      View on OpenSea
                      <ExternalIcon className="ml-auto text-blur-white/70" />
                    </Link>
                  )}
                  {/* {etherscanUrl && (
                    <Link
                      href={etherscanUrl}
                      className="flex items-center gap-2 rounded-10 px-2 py-[5px] text-15 font-500 text-white-100 transition-colors hover:bg-white-5"
                    >
                      <div className="flex items-center justify-center">
                        <EtherscanIcon />
                      </div>
                      View on Etherscan
                      <ExternalIcon className="ml-auto text-blur-white/70" />
                    </Link>
                  )} */}
                </div>
              </Popover.Content>
            </Popover.Root>
            <Dialog.Close asChild>
              <button className="rounded-10 border border-white-10 p-[6px] transition-colors hover:border-white-20">
                <CloseIcon className="text-white-100" />
              </button>
            </Dialog.Close>
          </div>
          <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transform">
            <img
              src={fullSizeSrc}
              alt={name}
              className="max-h-[calc(100svh-112px)] w-auto object-contain"
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
