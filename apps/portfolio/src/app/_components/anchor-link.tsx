import { Link } from '../_components/link'

export const AnchorLink = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => (
  <>
    <span className="absolute -left-6 hidden scrollbar-none lg:group-hover:inline">
      #
    </span>
    <Link href={`#${id}`} aria-hidden="true" tabIndex={-1}>
      {children}
    </Link>
  </>
)
