import * as Dialog from '@radix-ui/react-dialog'
import * as Popover from '@radix-ui/react-popover'
import { Button, Text } from '@status-im/components'
import { CloseIcon, PopupIcon } from '@status-im/icons/20'

import { useMediaQuery } from '~hooks/use-media-query'

type ExplanationType = {
  title: string
  description: React.ReactNode
}

type Props = ExplanationType & {
  children?: React.ReactNode
}

const defaultTrigger = (
  <button className="inline-block p-1 align-bottom">
    <PopupIcon className="text-neutral-50" />
  </button>
)

const ExplanationDesktop = (props: Props) => {
  const { title, description, children = defaultTrigger } = props

  return (
    <Popover.Root modal>
      <Popover.Anchor asChild>
        <Popover.Trigger asChild>{children}</Popover.Trigger>
      </Popover.Anchor>

      <Popover.Portal>
        <>
          <div className="fixed inset-0 bg-blur-neutral-100/70" />
          <Popover.Content
            side={'right'}
            sideOffset={10}
            collisionPadding={40}
            className="bottom-0 m-auto mb-0 w-full max-w-full translate-x-0 translate-y-0 overflow-y-auto rounded-t-20 bg-white-100 data-[state=closed]:animate-explanationOut data-[state=open]:animate-explanationIn sm:bottom-auto sm:mx-auto sm:max-w-[480px] sm:rounded-20"
          >
            <div className="absolute right-3 top-3">
              <Popover.Close asChild>
                <Button
                  variant="grey"
                  size="32"
                  icon={<CloseIcon />}
                  aria-label="Close"
                />
              </Popover.Close>
            </div>
            <div className="pb-2 pl-4 pr-14 pt-4">
              <Text size={19} weight="semibold">
                {title}
              </Text>
            </div>
            <div className="flex max-h-[calc(100vh-226px)] flex-1 flex-col overflow-y-auto px-4 pb-4 pt-0">
              {description}
            </div>
          </Popover.Content>
        </>
      </Popover.Portal>
    </Popover.Root>
  )
}

const ExplanationMobile = (props: Props) => {
  const { title, description, children = defaultTrigger } = props

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blur-neutral-100/70" />
        <Dialog.Content className="fixed bottom-0 left-0 m-auto mb-0 flex max-h-[calc(100vh-138px)] w-full max-w-full flex-col rounded-t-20 bg-white-100 data-[state=closed]:animate-explanationSlideDown data-[state=open]:animate-explanationSlideUp">
          <div className="absolute right-5 top-5">
            <Dialog.Close asChild>
              <Button
                variant="grey"
                size="32"
                icon={<CloseIcon />}
                aria-label="Close"
              />
            </Dialog.Close>
          </div>
          <div className="pb-2 pl-4 pr-16 pt-4">
            <Text size={19} weight="semibold">
              {title}
            </Text>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-4 pt-0">
            {description}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const Explanation = (props: Props) => {
  const matches = useMediaQuery('lg')

  return matches ? (
    <ExplanationDesktop {...props} />
  ) : (
    <ExplanationMobile {...props} />
  )
}

export { Explanation }
export type { ExplanationType }
