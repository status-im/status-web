import * as Tooltip from '@radix-ui/react-tooltip'

type Props = {
  children: React.ReactNode
  label: string
  side?: Tooltip.TooltipContentProps['side']
  hidden?: boolean
}

const TooltipBase = (props: Props) => {
  const { children, label, hidden, side = 'right' } = props

  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            hidden={hidden}
            className="relative select-none rounded-8 border border-neutral-10 bg-white-100 px-3 py-2 text-13 font-medium leading-none text-neutral-100 shadow-3 will-change-[transform,opacity] data-[state=delayed-open]:animate-in"
            side={side}
            sideOffset={4}
            align="center"
          >
            {label}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export { TooltipBase as Tooltip }
