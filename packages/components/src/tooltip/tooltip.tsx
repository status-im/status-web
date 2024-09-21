import * as Tooltip from '@radix-ui/react-tooltip'
import { cx } from 'cva'

type Props = Omit<Tooltip.TooltipContentProps, 'content'> & {
  delayDuration?: number
  children: React.ReactElement
  content: React.ReactNode
}

const _Tooltip = (props: Props) => {
  const {
    children,
    content,
    delayDuration = 0,
    sideOffset = 8,
    ...contentProps
  } = props

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={delayDuration}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={sideOffset}
            {...contentProps}
            className={cx(
              'z-50 cursor-default rounded-8 border border-neutral-10 bg-white-100 px-3 py-1.5 text-13 font-medium shadow-3',
              'dark:border-neutral-80 dark:bg-neutral-90 dark:text-white-100',
            )}
          >
            {content}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

export { _Tooltip as Tooltip }
export type { Props as TooltipProps }
