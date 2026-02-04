import { Link as LinkBase } from '@tanstack/react-router'

type LinkProps = {
  href: string
  scroll?: boolean
  className?: string
  children: React.ReactNode
}

const Link = (props: LinkProps) => {
  const { href, scroll, className, children } = props
  return (
    <LinkBase to={href} resetScroll={scroll} className={className}>
      {children}
    </LinkBase>
  )
}

export { Link }
