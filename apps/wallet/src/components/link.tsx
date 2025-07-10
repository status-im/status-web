import { Link as LinkBase } from '@tanstack/react-router'

type LinkProps = {
  href: string
  className?: string
  children: React.ReactNode
}

const Link = (props: LinkProps) => {
  const { href, className, children } = props
  return (
    <LinkBase to={href} className={className}>
      {children}
    </LinkBase>
  )
}

export { Link }
