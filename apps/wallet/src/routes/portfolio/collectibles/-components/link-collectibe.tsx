import { Link as LinkBase, useRouter } from '@tanstack/react-router'

type LinkProps = {
  href: string
  scroll?: boolean
  className?: string
  children: React.ReactNode
}

let _savedScrollTop = 0

const getSavedScrollTop = () => _savedScrollTop

const LinkCollectible = (props: LinkProps) => {
  const { href, className, children } = props
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    const scrollContainer = (e.currentTarget as HTMLElement).closest(
      '.scrollbar-stable',
    )
    if (scrollContainer) {
      _savedScrollTop = scrollContainer.scrollTop
    }

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

export { getSavedScrollTop, LinkCollectible }
