import { cx } from 'class-variance-authority'

import { Navbar } from '~admin/_components/nav-bar'
import { api } from '~server/trpc/server'

type Props = {
  children: React.ReactNode
}

const Content = async ({ children }: Props) => {
  const user = await api.user()

  return (
    <div className="isolate hidden bg-neutral-100 px-1 pb-1 2md:block">
      <Navbar user={user} />
      <div
        className={cx(
          `relative z-10 h-[calc(100vh-60px)] w-full overflow-hidden text-clip rounded-[24px]`,
          'bg-white-100'
        )}
      >
        <div className="flex h-[calc(100vh-60px)] w-full flex-row overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

export { Content }
