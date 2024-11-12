import { useCallback, useEffect, useRef, useState } from 'react'

import { useStorage } from '@plasmohq/storage/hook'
import styleText from 'data-text:../style.css' // eslint-disable-line import/no-unresolved
import logoSrc from 'url:../../assets/logo.png'

import { Connected } from '~components/connected'
import { NotConnected } from '~components/not-connected'
import { PinInstructions } from '~components/pin-instructions'
import { StatusTag } from '~components/status-tag'
import { useLocalStorage } from '~hooks/use-local-storage'
import { useOutsideClick } from '~hooks/use-outside-click'
import { ServiceWorkerMessage } from '~messages/service-worker-message'

import type { PlasmoGetStyle } from 'plasmo'

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement('style')
  style.textContent = styleText
  return style
}

type MessageHandler = Parameters<typeof chrome.runtime.onMessage.addListener>[0]

export default function Popup() {
  const [connected] = useStorage('status:desktop:running')
  const [showPinInstructions] = useStorage('show-pin-instructions', true)

  const [reopen, setReopen] = useLocalStorage('status:popup:reopen', false)
  const [open, setOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const handleOutsideClick = useCallback(() => setOpen(false), [])

  useOutsideClick(containerRef, handleOutsideClick)

  useEffect(() => {
    const handleMessage: MessageHandler = (message: ServiceWorkerMessage) => {
      try {
        message = ServiceWorkerMessage.parse(message)
      } catch {
        return
      }

      if (message.type === 'status:icon:clicked') {
        setOpen(open => !open)
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  useEffect(() => {
    if (reopen) {
      setOpen(true)
      setReopen(false)
    }
  }, [reopen, setReopen])

  if (!open) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="fixed right-2 top-2 max-w-[390px] overflow-hidden rounded-3xl"
    >
      <div className="grid w-full grid-rows-[auto,1fr] rounded-3xl bg-neutral-100">
        {/* Bar */}
        <div className="flex items-center justify-between px-5 py-3">
          <img src={logoSrc} alt="Status" className="size-8" />
          <StatusTag status={connected ? 'on' : 'off'} />
        </div>

        <div className="mx-1 mb-1 overflow-hidden rounded-[20px] bg-white-100 p-5">
          {connected ? <Connected /> : <NotConnected />}
          {showPinInstructions && <PinInstructions />}
        </div>
      </div>
    </div>
  )
}
