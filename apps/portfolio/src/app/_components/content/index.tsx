// note: primarily uses margin, not padding, to create space between elements
import { Children, cloneElement, type ComponentProps } from 'react'

import { Step } from '@status-im/components'
import { BulletIcon, CheckIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { match } from 'ts-pattern'

import { AnchorLink } from '../../_components/anchor-link'
import { renderText } from '../../_utils/render-text'
import { Link } from '../link'
import { CodeBlock } from './code-block'

const paragraphMarginTop: Record<27 | 19 | 15 | 13, string> = {
  // note: ref `lineHeight` in tailwind.config.ts#theme.fontSize
  27: '[&+p]:!mt-[2rem]',
  19: '[&+p]:!mt-[1.75rem]',
  15: '[&+p]:!mt-[1.359375rem]',
  13: '[&+p]:!mt-[1.1375rem]',
}

const paragraphMarginVertical: Record<6 | 5, string> = {
  // note: Starting with Firefox 119, the :has() selector is now available in nightly builds – https://www.mozilla.org/en-US/firefox/120.0a1/releasenotes/
  // 6: 'mt-6 [&:not(:has(+p))]:mb-6', // bottom margin for only the paragraphs not followed by any other sibling paragraph element
  // 5: 'mt-5 [&:not(:has(+p))]:mb-5',
  6: 'mt-6 [&+:not(:is(p))]:pt-6', // simulates bottom margin with extra top padding applied to any other sibling element that is not a paragraph but follows one
  5: 'mt-5 [&+:not(:is(p))]:pt-5',
}

const paragraphTextSize: Record<27 | 19 | 15 | 13, string> = {
  27: 'text-27',
  19: 'text-19',
  15: 'text-15',
  13: 'text-13',
}

const blockquoteParagraphTextSize: Record<27 | 19, string> = {
  27: '[&>p>*]:text-27',
  19: '[&>p>*]:text-19',
}

const baseComponents = {
  strong: (
    props: ComponentProps<'strong'> & {
      size?: 19 | 15 | 13
    }
  ) => {
    return (
      <strong
        {...props}
        className={cx('font-semibold', paragraphTextSize[props.size ?? 19])}
      >
        {props.children}
      </strong>
    )
  },
  del: (
    props: ComponentProps<'del'> & {
      size?: 19 | 15 | 13
    }
  ) => {
    return (
      <del
        {...props}
        className={cx('line-through', paragraphTextSize[props.size ?? 19])}
      >
        {props.children}
      </del>
    )
  },
  em: (
    props: ComponentProps<'em'> & {
      size?: 19 | 15 | 13
    }
  ) => {
    return (
      <em
        {...props}
        className={cx(
          'font-[Inter,-apple-system,system-ui]',
          'italic',
          paragraphTextSize[props.size ?? 19]
        )}
      >
        {props.children}
      </em>
    )
  },
  h1: (props: ComponentProps<'h1'>) => {
    return (
      <h1 {...props} className="group relative text-40 font-bold">
        <AnchorLink id={props.id!}>{props.children}</AnchorLink>
      </h1>
    )
  },
  h2: (props: ComponentProps<'h2'> & { mb?: string; mt?: string }) => {
    const { children, id, mb = 'mb-3', mt = 'mt-5', ...rest } = props
    return (
      <h2
        id={id}
        {...rest}
        className={cx(
          mb,
          mt,
          'group relative scroll-m-[100px] text-27 font-semibold'
        )}
      >
        <AnchorLink id={id!}>{children}</AnchorLink>
      </h2>
    )
  },
  h3: (props: ComponentProps<'h3'>) => {
    return (
      <h3
        {...props}
        className="group relative mb-3 mt-5 scroll-m-[100px] text-19 font-semibold"
      >
        <AnchorLink id={props.id!}>{props.children}</AnchorLink>
      </h3>
    )
  },
  h4: (props: ComponentProps<'h4'>) => {
    return (
      <h4
        {...props}
        className="group relative mb-3 mt-5 scroll-m-[100px] text-15 font-semibold"
      >
        <AnchorLink id={props.id!}>{props.children}</AnchorLink>
      </h4>
    )
  },
  h5: (props: ComponentProps<'h5'>) => {
    return (
      <h5
        {...props}
        // className="group relative mb-3 mt-5 scroll-m-[100px] text-13 font-semibold"
        className="group relative mb-3 mt-5 scroll-m-[100px] text-15 font-semibold"
      >
        <AnchorLink id={props.id!}>{props.children}</AnchorLink>
      </h5>
    )
  },
  h6: (props: ComponentProps<'h6'>) => {
    return (
      <h6
        {...props}
        // className="group relative mb-3 mt-5 scroll-m-[100px] text-11 font-semibold"
        className="group relative mb-3 mt-5 scroll-m-[100px] text-15 font-semibold"
      >
        <AnchorLink id={props.id!}>{props.children}</AnchorLink>
      </h6>
    )
  },
  blockquote: (props: ComponentProps<'blockquote'> & { size?: 19 | 27 }) => {
    const { children, size = 27, ...rest } = props

    const blockquoteChildren = Children.toArray(children).filter(
      child => child !== '\n'
    )

    return (
      <blockquote
        {...rest}
        className={cx(
          blockquoteParagraphTextSize[size],
          'mt-5 border-l border-dashed border-neutral-30 !pt-0 pl-6'
        )}
      >
        {/* {children} */}
        {/* {renderText({ children, size: paragraphTextSize[size] }))} */}
        {Children.map(blockquoteChildren, (item: any) => {
          if (typeof item === 'string') {
            return renderText({ children: item, size: paragraphTextSize[size] })
          }

          if (item.type === 'p') {
            return cloneElement(item, { size })
          }

          return item
        })}
      </blockquote>
    )
  },
  a: (
    props: ComponentProps<'a'> & {
      size?: 19 | 15 | 13
    }
  ) => {
    if (!props.href) {
      const { children, ...rest } = props
      return (
        <a
          {...rest}
          className={cx(
            'text-customisation-blue-50',
            paragraphTextSize[props.size ?? 19]
          )}
        >
          {children}
        </a>
      )
    }

    return (
      <Link
        {...(props as any)}
        href={props.href}
        className={cx(
          'text-customisation-blue-50',
          paragraphTextSize[props.size ?? 19]
        )}
      >
        {props.children}
      </Link>
    )
  },
  p: (
    props: ComponentProps<'p'> & {
      size?: 27 | 19 | 15 | 13
      my?: 6 | 5
    }
  ) => {
    const { children, size = 19, my = 5 } = props

    if (
      (props as any).children?.type?.name === 'img' ||
      (props as any).parent === 'li'
    ) {
      return <>{props.children}</>
    }

    return (
      <p
        className={cx(
          paragraphMarginVertical[my],
          paragraphMarginTop[size],
          '[:is(h1,h2,h3,h4,h5,h6)+&]:!mt-0', // immediately follows a heading as a sibling element
          // '[&:not(:has(+*))]:!mb-0', // not followed by any sibling element
          '[:is(div,td,blockquote)>&:first-child]:!mt-0' // is a first child of selected parent element
        )}
      >
        {renderText({ children, size: paragraphTextSize[size] })}
      </p>
    )
  },
  ul: (props: ComponentProps<'ul'>) => {
    return (
      <ul className="flex flex-col gap-3 [:is(ul)+&]:mt-5 [ul_&]:mt-3">
        {props.children}
      </ul>
    )
  },
  ol: (props: any & { parent?: string }) => {
    const listItems = Children.toArray(props.children).filter(
      child => typeof child === 'object'
      // child => Children.only(child)
    )

    return (
      <ol
        className="group flex flex-col gap-3 [:is(ol)+&]:mt-5 [ol_&]:mt-3"
        {...props}
      >
        {Children.map(listItems, (item: any, index) =>
          cloneElement(item, {
            order: index + 1,
            parent: props.parent ?? 'ol',
          })
        )}
      </ol>
    )
  },
  li: (
    props: ComponentProps<'li'> & {
      size?: 19 | 15 | 13
      parent?: 'ol' | 'AwaitedList'
      order?: number
      variant?: React.ComponentProps<typeof Step>['variant']
    }
  ) => {
    const icon = match(props.parent)
      .with('ol', () => (
        <Step variant={props.variant ?? 'primary'} value={props.order!} />
      ))
      .with('AwaitedList', () => <CheckIcon className="text-success-50" />)
      .otherwise(() => <BulletIcon className="text-neutral-50" />)

    return (
      <li className="flex items-start gap-2">
        <div
          className={cx(
            'flex shrink-0 items-center',
            props.size === 19 ? 'h-[28px]' : 'h-[24px]'
          )}
        >
          {icon}
        </div>
        <div className="w-full">
          {renderText({
            children: props.children,
            size: paragraphTextSize[props.size ?? 19],
            parent: 'li',
          })}
        </div>
      </li>
    )
  },
  // handled conditionally per use case with divider component
  hr: () => {
    return <></>
  },
  img: (props: any) => {
    return <img {...props} className="my-5 rounded-20" />
  },
  pre: (props: ComponentProps<'pre'>) => (
    <pre {...props} className="overflow-scroll scrollbar-none" />
  ),
  div: (props: ComponentProps<'div'>) => {
    // note: style parent elements of `code` wrapped by `rehype-pretty-code` plugin
    if (Object.hasOwn(props, 'data-rehype-pretty-code-fragment')) {
      return <CodeBlock {...props} />
    }

    return <div {...props} />
  },
  code: (props: any) => {
    const multiline = Children.toArray(props.children).length > 1

    if (
      !multiline &&
      (typeof props.children === 'string' ||
        (Array.isArray(props.children) &&
          typeof props.children[0] === 'string'))
    ) {
      return (
        // note: https://www.figma.com/file/qSIh8wh9EVdY8S2sZce15n/Composer-for-Desktop?type=design&node-id=7850-672452&mode=design&t=V9tDjCw6RLuPF4F6-4
        <code
          {...props}
          className="inline-block rounded-10 border border-neutral-10 bg-neutral-5 px-2 font-regular"
        />
      )
    }

    // todo?: https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?type=design&node-id=5626-159428&mode=design&t=stTlBeUAUUi4JR0v-4
    // note: http://localhost:3000/help/getting-started/download-status-for-linux example for scrolling
    return <code className="w-fit" {...props} />
  },
  figure: (props: ComponentProps<'figure'>) => (
    <figure {...props} className="my-5" />
  ),
  iframe: (props: React.ComponentProps<'iframe'>) => {
    // todo?: match youtube props to use aspect-video
    return (
      <iframe
        {...props}
        title={props.title}
        className="aspect-video size-full rounded-20"
      />
    )
  },
}

const SpaceDivider = (props: React.ComponentPropsWithoutRef<'div'>) => {
  return (
    <div
      className={cx(
        // 'box-content', // due to bottom margin simulation from content.tsx#paragraphMarginVertical
        'mt-5 first:mt-0',
        'h-6 w-full',
        props.className
      )}
      role="separator"
    />
  )
}

export const legalComponents = {
  ...baseComponents,
  p: (props: Parameters<typeof baseComponents.p>[0]) => {
    return baseComponents.p({ ...props, my: 6 })
  },
  h2: (props: ComponentProps<'h2'>) => {
    return (
      <>
        <SpaceDivider className="h-4 first-of-type:h-14" />
        {baseComponents.h2({ ...props, mb: 'mb-4', mt: 'mt-6' })}
      </>
    )
  },
}

export const legalPortfolioComponents = {
  ...baseComponents,
  strong: (props: Parameters<typeof baseComponents.strong>[0]) => {
    return baseComponents.strong({ ...props, size: 13 })
  },
  p: (props: Parameters<typeof baseComponents.p>[0]) => {
    return baseComponents.p({ ...props, size: props.size ?? 15 })
  },
  a: (props: Parameters<typeof baseComponents.a>[0]) => {
    return baseComponents.a({ ...props, size: 15 })
  },
  h2: (props: ComponentProps<'h2'>) => {
    return baseComponents.h2({
      ...props,
      style: {
        fontSize: '15px',
      },
    })
  },
  li: (props: Parameters<typeof baseComponents.li>[0]) => {
    return baseComponents.li({ ...props, size: 15 })
  },
}

export const portfolioComponents = {
  ...baseComponents,
  h1: (props: ComponentProps<'h2'>) => {
    return baseComponents.h2({
      ...props,
      style: {
        fontSize: '15px',
      },
    })
  },
  h2: (props: ComponentProps<'h2'>) => {
    return baseComponents.h2({
      ...props,
      mb: 'mb-0',
      style: {
        fontSize: '15px',
      },
    })
  },
  p: (props: Parameters<typeof baseComponents.p>[0]) => {
    return baseComponents.p({ ...props, size: props.size ?? 15 })
  },
  a: (props: Parameters<typeof baseComponents.a>[0]) => {
    return baseComponents.a({ ...props, size: 15 })
  },
  strong: (props: Parameters<typeof baseComponents.strong>[0]) => {
    return baseComponents.strong({ ...props, size: 15 })
  },
  li: (props: Parameters<typeof baseComponents.li>[0]) => {
    return baseComponents.li({ ...props, size: 15 })
  },
}
