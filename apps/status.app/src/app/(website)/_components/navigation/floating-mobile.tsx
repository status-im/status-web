import { useRef } from 'react'

import { animated } from '@react-spring/web'
import { IconButton } from '@status-im/components'
import { CloseIcon, MenuIcon } from '@status-im/icons/20'
import { RemoveScroll } from 'react-remove-scroll'

import { Link } from '~components/link'
import { Logo } from '~components/logo'

import { DownloadDesktopButton } from '../download-desktop-button'
import { AccordionMenu } from './accordion-menu'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const FloatingMobile = (props: Props) => {
  const { open, setOpen } = props

  const ref = useRef<HTMLDivElement>(null)
  const height = ref.current?.getBoundingClientRect().height || 0

  return (
    <RemoveScroll enabled={open} className="w-full" data-theme="dark">
      <div className="z-10 flex w-full items-center justify-between">
        <div className="flex">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <IconButton
          icon={open ? <CloseIcon /> : <MenuIcon />}
          variant="outline"
          onPress={() => setOpen(!open)}
        />
      </div>

      <animated.div
        style={{
          height: open ? height + 8 : 0,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          overflow: open ? 'auto' : 'hidden',
        }}
        className="z-10 flex w-full flex-col justify-between pt-2 transition-all scrollbar-none"
        data-theme="dark"
        data-background="blur"
      >
        <div ref={ref}>
          <AccordionMenu />

          <div className="flex flex-col items-stretch justify-stretch gap-2 py-3">
            <DownloadDesktopButton variant="primary" show="all" />
          </div>
        </div>
      </animated.div>
    </RemoveScroll>
  )
}

export { FloatingMobile }
