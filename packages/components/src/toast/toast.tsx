import { cloneElement, forwardRef } from 'react'

import { Action, Close, Description } from '@radix-ui/react-toast'
import { CloseIcon } from '@status-im/icons/16'
import { CorrectIcon, IncorrectIcon } from '@status-im/icons/20'
import { match, P } from 'ts-pattern'

import { Button } from '../button'

import type { IconElement } from '../types'

type Props = {
  message: string
  action?: string
  onAction?: () => void
} & ({ type: 'positive' | 'negative' } | { icon: IconElement })

const Toast = (props: Props, ref: React.Ref<HTMLDivElement>) => {
  const { message, action, onAction } = props

  return (
    <div
      ref={ref}
      className="flex min-h-[40px] w-[351px] flex-row items-start justify-between gap-3 rounded-12 bg-neutral-80/70 p-[10px] pr-3 backdrop-blur-[20px]"
    >
      <div className="flex flex-1 flex-row items-start gap-1">
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
      {onAction && (
        <Close>
          <CloseIcon className="cursor-pointer text-white-100" />
        </Close>
      )}
    </div>
  )
}

const _Toast = forwardRef(Toast)

export { _Toast as Toast }
export type { Props as ToastProps }
