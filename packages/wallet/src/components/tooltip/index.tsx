import * as Tooltip from '@radix-ui/react-tooltip'
import { cx } from 'class-variance-authority'

type Props = {
  children: React.ReactNode
  label: React.ReactNode
  side?: Tooltip.TooltipContentProps['side']
  hidden?: boolean
  defaultOpen?: boolean
  sideOffset?: number
}

const TooltipBase = (props: Props) => {
  const {
    children,
    label,
    hidden,
    side = 'right',
    defaultOpen,
    sideOffset = 4,
  } = props

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root open={defaultOpen}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            hidden={hidden}
            className={cx(
              `relative select-none rounded-8 border border-neutral-10 bg-white-100 px-3 py-2 text-13 font-medium leading-none text-neutral-100 shadow-3`,
              'will-change-[transform,opacity] data-[state=delayed-open]:animate-in',
            )}
            side={side}
            sideOffset={sideOffset}
            align="center"
          >
            <div className="flex items-center justify-center gap-2">
              {label}
            </div>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export { TooltipBase as Tooltip }
