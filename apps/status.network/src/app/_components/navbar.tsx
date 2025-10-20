import { ROUTES } from '~/config/routes'
import Image from 'next/image'
import { ButtonLink } from './button-link'
import { Divider } from './divider'
import { Link } from './link'

const NavBar = () => {
  return (
    <header className="sticky left-0 top-0 z-40 hidden w-full bg-white-90 backdrop-blur supports-[backdrop-filter]:bg-white-80 lg:block">
      <nav className="mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="Status Network Logo"
            width={210}
            height={32}
          />
        </Link>
        <div className="hidden items-center space-x-6 md:flex">
          {ROUTES.Navigation.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className="text-15 font-500 text-neutral-100 transition-colors hover:text-neutral-80/60"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <ButtonLink
            href={ROUTES.Docs}
            variant="white"
            size="32"
            className="hidden sm:block"
          >
            Read docs
          </ButtonLink>
          <ButtonLink href={ROUTES.Bridge} size="32">
            Get started
          </ButtonLink>
        </div>
      </nav>
      <Divider />
    </header>
  )
}

export { NavBar }
