import { Link as LinkBase, useRouter } from '@tanstack/react-router'

type LinkProps = {
  href: string
  className?: string
  children: React.ReactNode
}

const LinkCollectible = (props: LinkProps) => {
  const { href, className, children } = props
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    const [network, contract, id] = href.split('/').slice(-3)

    router.navigate({
      to: '/portfolio/collectibles/$network/$contract/$id',
      params: { network, contract, id },
    })
  }

  return (
    <LinkBase to={href} className={className} onClick={handleClick}>
      {children}
    </LinkBase>
  )
}

export { LinkCollectible }
