import { Button, IconButton } from '@felicio/components'
import { CloseIcon, DownloadIcon, MenuIcon } from '@felicio/icons'

import { Link } from '../link'
import { Logo } from '../logo'
import { AccordionMenu } from './accordion-menu'

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const FloatingMobile = (props: Props) => {
  const { open, setOpen } = props
  return (
    <div className="w-full">
      <div className="z-10 flex w-full items-center justify-between">
        <div className="flex">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <IconButton
          variant="outline"
          icon={
            open ? (
              <CloseIcon size={20} color={'$white-100'} />
            ) : (
              <MenuIcon size={20} />
            )
          }
          onPress={() => setOpen(!open)}
        />
      </div>
      <div
        style={{
          height: open ? '100%' : 0,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          overflow: open ? 'auto' : 'hidden',
        }}
        className={`z-10 flex w-full flex-col justify-between pt-2`}
      >
        <AccordionMenu />
        <div className="flex justify-center py-3">
          <Button
            size={40}
            variant="grey"
            icon={<DownloadIcon size={20} />}
            fullWidth
          >
            Sign up for early access
          </Button>
        </div>
      </div>
    </div>
  )
}

export { FloatingMobile }
