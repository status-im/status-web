import { cx } from 'class-variance-authority'

export function getTabLinkClassName(isActive?: boolean, className?: string) {
  return cx(
    'flex items-center rounded-10 bg-neutral-10 px-3 py-1 text-15 font-medium text-neutral-100',
    isActive && 'bg-neutral-50 text-white-100',
    className,
  )
}
