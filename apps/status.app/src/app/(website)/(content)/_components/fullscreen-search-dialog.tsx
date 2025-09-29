'use client'

import { useEffect, useMemo, useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@status-im/components'
import {
  // ChevronRightIcon,
  ClearIcon,
  CloseIcon,
} from '@status-im/icons/20'
import Image from 'next/image'
import { match } from 'ts-pattern'

import config from '~/config/help/config.json'
import { slugify } from '~app/_utils/slugify'
import { Link } from '~components/link'

import { useSearchEngine } from '../_hooks/use-search-engine'
import { getCategory } from '../help/(sidebar)/[...slug]/_utils/get-category'
import { HighlightMatches } from './highlight-matches'

import type { SearchType } from './search-button'

type Props = {
  children: React.ReactElement
  type: SearchType
  open: boolean
  onOpenChange: (open: boolean) => void
}

// const SEARCH_PARAGRAPH_LIMIT = 3

export const FullscreenSearchDialog = (props: Props) => {
  const { type, open, onOpenChange } = props

  const search = useSearchEngine(type)
  const [value, setValue] = useState('')

  useEffect(() => {
    search.query(value)
  }, [value])

  const { title, inputPlaceholder } = useMemo(() => {
    return match(type)
      .with('help', () => ({
        title: 'I need help with',
        inputPlaceholder: 'crypto',
      }))
      .with('specs', () => ({
        title: 'I am looking for',
        inputPlaceholder: 'scaling',
      }))
      .exhaustive()
  }, [type])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{props.children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-blur-white/70 backdrop-blur-md" />
        <Dialog.Content className="fixed inset-0 z-50 overflow-y-auto scrollbar-none">
          <div
            className="sticky right-0 top-0 ml-auto w-fit p-3"
            data-background="blur"
          >
            <Dialog.Close asChild>
              <Button
                icon={<CloseIcon />}
                size="32"
                variant="grey"
                aria-label="Close"
              />
            </Dialog.Close>
          </div>
          <div className="mx-auto mt-6 w-full px-5 lg:max-w-[694px]">
            <div className="grid gap-1">
              <span className="text-27 font-medium text-blur-neutral-80/80">
                {title}
              </span>
              <div className="flex flex-row items-center justify-between">
                <input
                  ref={ref => ref?.focus()}
                  className="block w-full bg-transparent font-sans text-40 font-semibold leading-normal caret-customisation-blue-50 placeholder:text-neutral-80/20 lg:text-64 lg:leading-normal"
                  placeholder={inputPlaceholder}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                />
                {value.length > 0 && (
                  <button
                    onClick={() => setValue('')}
                    className="flex size-6 items-center justify-center"
                  >
                    <ClearIcon className="text-neutral-80/40" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col divide-y divide-dashed divide-neutral-80/20 pb-6 pt-[80px]">
              {value !== '' && search.results.length === 0 && (
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <Image
                    alt="No results found"
                    src="/assets/chart/empty.png"
                    width={80}
                    height={80}
                  />
                  <div className="pb-3" />
                  <span className="text-15 font-semibold">
                    No results for &apos;{value}&apos;.
                  </span>
                  <div className="pb-1" />
                  <span className="text-13 text-neutral-100">
                    Please try another search.
                  </span>
                </div>
              )}

              {search.results.map((result, idx) => {
                // const isIndex =
                //   result.path.replace('/help/', '').split('/').length === 1
                const category = getCategory(config, result.path)
                const title = result.title
                const heading = result.headings[0]
                const paragraph = heading.paragraphs[0]

                return (
                  <div key={idx} className="py-4">
                    <Link
                      href={{
                        pathname: result.path,
                        hash: slugify(heading.text),
                      }}
                      className="-mx-3 flex flex-col gap-2 rounded-16 px-3 hover:-my-2 hover:bg-customisation-blue-50/5 hover:py-2"
                      onClick={() => onOpenChange(false)}
                    >
                      <div className="flex flex-row items-end gap-0.5 self-stretch">
                        <span className="text-13 text-blur-neutral-80/80">
                          {category}
                        </span>
                        {/* note: should consists of category and subcaterogy, no title */}
                        {/* {isIndex
                        ? category
                        : [category, title].map((p, i) => (
                            <>
                              {i > 0 ? (
                                <ChevronRightIcon
                                  size={16}
                                  color="$neutral-80/80"
                                />
                              ) : null}
                              <Text size={13} color="$neutral-80/80">
                                {p}
                              </Text>
                            </>
                          ))} */}
                      </div>

                      <span className="text-19 font-semibold">
                        <HighlightMatches
                          text={title}
                          searchWords={result.match}
                        />
                      </span>

                      <span className="text-15">
                        <HighlightMatches
                          text={paragraph.text}
                          searchWords={paragraph.match}
                        />
                      </span>

                      {result.totalParagraphMatches > 1 && (
                        <div className="pt-2">
                          <span className="text-13 text-neutral-80/60">
                            +{result.totalParagraphMatches - 1} matches in this
                            document
                          </span>
                        </div>
                      )}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
