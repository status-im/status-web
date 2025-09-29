'use client'

import { forwardRef } from 'react'

import { AddIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { LinkProps } from 'next/link'
import type { Ref } from 'react'

type Props = (LinkProps | React.ComponentProps<'button'>) & {
  children: string
}

const styles = cx(
  'flex h-10 w-full items-center justify-center gap-1 rounded-12 border border-dashed border-neutral-30 py-[9px] pl-3 pr-4 text-center text-15 font-medium',
  'hover:border-neutral-40 active:border-customisation-blue-50/20 active:bg-customisation-blue-50/5',
  'disabled:border-neutral-20 disabled:opacity-[30%]',
  'data-[active=true]:border-customisation-blue-50/20 data-[active=true]:bg-customisation-blue-50/5'
)

const AddNewButton = (props: Props, ref: Ref<any>) => {
  const { children } = props

  const pathname = usePathname()

  if ('href' in props) {
    const active = pathname === props.href

    return (
      <Link ref={ref} {...props} data-active={active} className={styles}>
        <AddIcon /> {children}
      </Link>
    )
  }

  return (
    <button ref={ref} type="button" {...props} className={styles}>
      <AddIcon /> {children}
    </button>
  )
}

const _AddNewButton = forwardRef(AddNewButton)

export { _AddNewButton as AddNewButton }
