import { cloneElement, forwardRef } from 'react'

import { Action, Description } from '@radix-ui/react-toast'
import { CorrectIcon, IncorrectIcon } from '@status-im/icons/20'
import { match, P } from 'ts-pattern'

import { Button } from '../button'

import type { IconComponent } from '../types'

type Props = {
  message: string
  action?: string
  onAction?: () => void
} & ({ type: 'positive' | 'negative' } | { icon: IconComponent })

const Toast = (props: Props, ref: React.Ref<HTMLDivElement>) => {
  const { message, action, onAction } = props

  return (
    <div
      ref={ref}
      className="flex min-h-[40px] w-[351px] flex-row items-center justify-between gap-3 rounded-12 bg-neutral-80/70 p-2 pr-3"
    >
      <div className="flex flex-1 flex-row items-center gap-1">
        <div className="shrink-0">
          {match(props)
            .with({ type: 'positive' }, () => <CorrectIcon />)
            .with({ type: 'negative' }, () => <IncorrectIcon />)
            .with({ icon: P._ }, ({ icon: Icon }) =>
              cloneElement(Icon, { className: 'size-5 text-blur-white/70' }),
            )
            .exhaustive()}
        </div>
        <Description className="text-13 font-medium text-white-100">
          {message}
        </Description>
      </div>
      {action && (
        <div className="-mr-1 self-start">
          <Action asChild altText={action}>
            <Button size="24" variant="grey" onPress={() => onAction?.()}>
              {action}
            </Button>
          </Action>
        </div>
      )}
    </div>
  )
}

const _Toast = forwardRef(Toast)

export { _Toast as Toast }
export type { Props as ToastProps }
