import { Suspense } from 'react'

import { DetailDrawer } from '../_components/detail-drawer'

// export const experimental_ppr = true

type Props = {
  nav: React.ReactNode
  list: React.ReactNode
  detail: React.ReactNode
}

export default async function Layout({ nav, list, detail }: Props) {
  return (
    <div className="flex min-h-full overflow-hidden">
      <div className="grid flex-1 grid-cols-[auto_1fr] divide-x divide-neutral-10 overflow-hidden">
        <div>
          {/* {nav} */}
          <Suspense fallback={<div>Loading...</div>}>{nav}</Suspense>
        </div>

        <div className="flex divide-x divide-default-neutral-20 overflow-auto">
          {/* {list} */}
          <div className="flex grow 2xl:basis-1/2">
            <Suspense fallback={<div>Loading...</div>}>{list}</Suspense>
          </div>

          <div className="hidden basis-1/2 flex-col 2xl:flex">
            {/* {detail} */}
            <Suspense fallback={<div>Loading...</div>}>{detail}</Suspense>
          </div>

          <DetailDrawer>
            {/* {detail} */}
            <Suspense fallback={<div>Loading...</div>}>{detail}</Suspense>
          </DetailDrawer>
        </div>
      </div>
    </div>
  )
}
