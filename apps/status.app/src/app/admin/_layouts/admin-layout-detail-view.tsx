import { Breadcrumbs } from '~components/breadcrumbs'

import type { BreadcrumbsProps } from '~components/breadcrumbs'

type Props = {
  title: string
  children: React.ReactNode
  breadcrumbs: BreadcrumbsProps['items']
  avatar?: React.ReactNode
  description?: string
}

const AdminLayoutDetailView = (props: Props) => {
  const {
    title,
    children,
    breadcrumbs,
    avatar = null,
    description = null,
  } = props

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-20 bg-blur-white/70 xl:hidden">
        <Breadcrumbs items={breadcrumbs} variant="admin" />
      </div>

      <div className="grid max-w-[462px] gap-6 pb-16 max-xl:pt-8">
        <div className="grid gap-1">
          {avatar && <div className="pb-2">{avatar}</div>}
          <p className="text-19 font-semibold">{title}</p>
          {description && <p className="text-15">{description}</p>}
        </div>

        {children}
      </div>
    </>
  )
}

const AdminLayoutDetailViewSeparator = () => {
  return <hr className="h-0.5 border-neutral-10" />
}

AdminLayoutDetailView.Separator = AdminLayoutDetailViewSeparator

export { AdminLayoutDetailView }
export type { Props as AdminLayoutDetailViewProps }
