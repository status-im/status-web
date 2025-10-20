import { Link } from '~components/link'

export const AnchorLink = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => (
  <>
    <span className="absolute -left-10 hidden lg:group-hover:inline">#</span>
    <Link href={`#${id}`} aria-hidden="true" tabIndex={-1}>
      {children}
    </Link>
  </>
)
