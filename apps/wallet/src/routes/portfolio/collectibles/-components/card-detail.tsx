import { ExternalIcon } from '@status-im/icons/20'

type Props = {
  title: string
  children: React.ReactNode
  href?: string
}

const CardDetail = (props: Props) => {
  const { title, children } = props

  const isLink = Boolean(props.href)

  const Element = isLink ? 'a' : 'div'
  const elementProps = isLink
    ? {
        href: props.href,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {}

  return (
    <Element
      className="relative flex flex-col rounded-12 border border-neutral-10 bg-neutral-2.5 px-3 py-2"
      {...elementProps}
    >
      <div className="z-10 text-13 font-medium capitalize text-neutral-50">
        {title}
      </div>
      {isLink && (
        <ExternalIcon className="absolute right-2 top-2 size-4 text-neutral-50" />
      )}
      {children}
    </Element>
  )
}

export { CardDetail }
