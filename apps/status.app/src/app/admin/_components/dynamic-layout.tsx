'use client'

import { ChevronsRightIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { useLayoutContext } from '~admin/_contexts/layout-context'

type Props = {
  leftView: React.ReactNode
  rightView: React.ReactNode
}

const DynamicLayout = (props: Props) => {
  const { leftView, rightView } = props

  const { isExpanded, toggleExpandedState, isLeftViewVisible } =
    useLayoutContext()

  return (
    <div className="relative flex h-[calc(100vh-60px)] w-full">
      <div
        className={cx([
          'bg-white-100',
          'z-10 flex flex-1 flex-col',
          'absolute left-0 top-0 size-full xl:relative',
          isLeftViewVisible
            ? 'translate-x-0'
            : '-translate-x-full xl:translate-x-0',
          isExpanded ? 'xl:w-fit' : 'xl:w-1/2',
        ])}
      >
        <div className="z-50 overflow-auto p-6 scrollbar-thin md:p-12">
          {leftView}
        </div>
        <button
          onClick={toggleExpandedState}
          className="group absolute right-2 z-40 flex h-[calc(100vh-60px)] w-6 translate-x-5 cursor-default items-center justify-center 4xl:cursor-pointer"
        >
          <div className="h-full w-px bg-neutral-10 transition-colors 4xl:group-hover:bg-neutral-30" />
          <div className="absolute left-4 z-30 hidden h-8 w-6 items-center justify-center rounded-8 opacity-[0%] group-hover:opacity-[100%] 4xl:flex">
            <div
              className={cx([
                '4xl:transition-all',
                isExpanded ? 'rotate-180' : 'rotate-0',
              ])}
            >
              <ChevronsRightIcon />
            </div>
          </div>
        </button>
      </div>
      <div
        className={cx([
          'relative z-0 size-full',
          'flex shrink xl:transition-all',
          isExpanded ? 'xl:w-[558px]' : 'xl:w-1/2',
          isLeftViewVisible
            ? 'translate-x-full xl:translate-x-0'
            : 'translate-x-0',
        ])}
      >
        <div className="absolute left-0 top-0 h-full w-[220px] bg-gradient-to-r from-customisation-blue-50/5 to-white-100" />
        <div className="absolute left-0 top-0 size-full bg-white-100 opacity-[75%]" />
        <div className="relative z-10 h-[calc(100vh-60px)] w-full overflow-auto p-6 scrollbar-thin md:p-12">
          {rightView}
        </div>
      </div>
    </div>
  )
}

export { DynamicLayout }
