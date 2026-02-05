import { Link as LinkBase, useRouter } from '@tanstack/react-router'

import { useCollectiblesScrollSaver } from '../-hooks/use-collectibles-scroll'

type LinkProps = {
  href: string
  scroll?: boolean
  className?: string
  children: React.ReactNode
}

const LinkCollectible = (props: LinkProps) => {
  const { href, className, children } = props
  const router = useRouter()
  const { saveScrollFromElement } = useCollectiblesScrollSaver()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    saveScrollFromElement(e.currentTarget as HTMLElement)

    const [network, contract, id] = href.split('/').slice(-3)

    router.navigate({
      to: '/portfolio/collectibles/$network/$contract/$id',
      params: { network, contract, id },
      resetScroll: false,
    })
  }

  return (
    <LinkBase
      to={href}
      className={className}
      onClick={handleClick}
      viewTransition
    >
      {children}
    </LinkBase>
  )
}

export { LinkCollectible }
