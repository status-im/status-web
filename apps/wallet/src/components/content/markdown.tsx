import {
  Children,
  cloneElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from 'react'

import { Step } from '@status-im/components'
import { BulletIcon, CheckIcon } from '@status-im/icons/20'
import { Link } from '@tanstack/react-router'
import { cx } from 'class-variance-authority'
import { match } from 'ts-pattern'

export function renderText(params: {
  children: React.ReactNode | React.ReactNode[]
  weight?: string
  color?: string
  parent?: string
}) {
  const {
    children,
    weight = 'font-regular',
    color = 'text-neutral-100',
    parent,
  } = params

  return Children.map(children, child => {
    if (typeof child === 'string') {
      return (
        <span
          className={cx(
            'text-15',
            weight,
            color,
            // 'break-word hyphens-manual break-all'
          )}
        >
          {child}
        </span>
      )
    }

    if (parent) {
      return cloneElement(child as ReactElement<{ parent?: string }>, {
        parent,
      })
    }

    return child
  })
}

const paragraphMarginTop = '[&+p]:!mt-[1.359375rem]'

const paragraphMarginVertical = 'mt-5 [&+:not(:is(p))]:pt-5'
const paragraphTextSize = 'text-15'

const blockquoteParagraphTextSize = '[&>p>*]:text-15'
const markdownComponents = {
  strong: (props: ComponentProps<'strong'>) => {
    return (
      <strong {...props} className={cx('font-semibold', paragraphTextSize)}>
        {props.children}
      </strong>
    )
  },
  del: (props: ComponentProps<'del'>) => {
    return (
      <del {...props} className={cx('line-through', paragraphTextSize)}>
        {props.children}
      </del>
    )
  },
  em: (props: ComponentProps<'em'>) => {
    return (
      <em
        {...props}
        className={cx(
          'font-[Inter,-apple-system,system-ui]',
          'italic',
          paragraphTextSize,
        )}
      >
        {props.children}
      </em>
    )
  },
  h1: (props: ComponentProps<'h1'>) => {
    return (
      <h1 {...props} className="group relative text-40 font-bold">
        {props.children}
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
          'group relative scroll-m-[100px] text-15 font-semibold',
        )}
      >
        {children}
      </h2>
    )
  },
  h3: (props: ComponentProps<'h3'>) => {
    return (
      <h3
        {...props}
        className="group relative mb-3 mt-5 scroll-m-[100px] text-15 font-semibold"
      >
        {props.children}
      </h3>
    )
  },
  h4: (props: ComponentProps<'h4'>) => {
    return (
      <h4
        {...props}
        className="group relative mb-3 mt-5 scroll-m-[100px] text-15 font-semibold"
      >
        {props.children}
      </h4>
    )
  },
  h5: (props: ComponentProps<'h5'>) => {
    return (
      <h5
        {...props}
        className="group relative mb-3 mt-5 scroll-m-[100px] text-15 font-semibold"
      >
        {props.children}
      </h5>
    )
  },
  h6: (props: ComponentProps<'h6'>) => {
    return (
      <h6
        {...props}
        className="group relative mb-3 mt-5 scroll-m-[100px] text-15 font-semibold"
      >
        {props.children}
      </h6>
    )
  },
  blockquote: (props: ComponentProps<'blockquote'>) => {
    const { children, ...rest } = props

    const blockquoteChildren = Children.toArray(children).filter(
      child => child !== '\n',
    ) as (ReactElement | string)[]

    return (
      <blockquote
        {...rest}
        className={cx(
          blockquoteParagraphTextSize,
          'mt-5 border-l border-dashed border-neutral-30 !pt-0 pl-6',
        )}
      >
        {Children.map(blockquoteChildren, (item: ReactElement | string) => {
          if (typeof item === 'string') {
            return renderText({ children: item })
          }

          if (item.type === 'p') {
            return cloneElement(item)
          }

          return item
        })}
      </blockquote>
    )
  },
  a: (props: ComponentProps<'a'>) => {
    if (!props.href) {
      const { children, ...rest } = props
      return (
        <a
          {...rest}
          className={cx('text-customisation-blue-50', paragraphTextSize)}
        >
          {children}
        </a>
      )
    }

    if (props.href.startsWith('/')) {
      return (
        <Link
          to={props.href}
          className={cx('text-customisation-blue-50', paragraphTextSize)}
        >
          {props.children}
        </Link>
      )
    }

    return (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cx('text-customisation-blue-50', paragraphTextSize)}
      >
        {props.children}
      </a>
    )
  },
  p: (props: ComponentProps<'p'> & { parent?: string }) => {
    const { children } = props

    if (
      (children as { type?: { name?: string } })?.type?.name === 'img' ||
      props.parent === 'li'
    ) {
      return <>{children}</>
    }

    return (
      <p
        className={cx(
          paragraphMarginVertical,
          paragraphMarginTop,
          '[:is(h1,h2,h3,h4,h5,h6)+&]:!mt-0', // immediately follows a heading as a sibling element
          // '[&:not(:has(+*))]:!mb-0', // not followed by any sibling element
          '[:is(div,td,blockquote)>&:first-child]:!mt-0', // is a first child of selected parent element
        )}
      >
        {renderText({ children })}
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
  ol: (props: ComponentProps<'ol'> & { parent?: string }) => {
    const listItems = Children.toArray(props.children).filter(
      child => typeof child === 'object',
    )

    return (
      <ol
        className="group flex flex-col gap-3 [:is(ol)+&]:mt-5 [ol_&]:mt-3"
        {...props}
      >
        {Children.map(listItems, (item: ReactNode, index) =>
          cloneElement(
            item as ReactElement<{ order?: number; parent?: string }>,
            {
              order: index + 1,
              parent: props.parent ?? 'ol',
            },
          ),
        )}
      </ol>
    )
  },
  li: (
    props: ComponentProps<'li'> & {
      parent?: 'ol' | 'AwaitedList'
      order?: number
      variant?: React.ComponentProps<typeof Step>['variant']
    },
  ) => {
    const icon = match(props.parent)
      .with('ol', () => (
        <Step variant={props.variant ?? 'primary'} value={props.order!} />
      ))
      .with('AwaitedList', () => <CheckIcon className="text-success-50" />)
      .otherwise(() => <BulletIcon className="text-neutral-50" />)

    return (
      <li className="flex items-start gap-2">
        <div className={cx('flex shrink-0 items-center', 'h-[24px]')}>
          {icon}
        </div>
        <div className="w-full">
          {renderText({
            children: props.children,
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
  img: (props: ComponentProps<'img'>) => {
    return <img {...props} alt={props.alt || ''} className="my-5 rounded-20" />
  },
  pre: (props: ComponentProps<'pre'>) => (
    <pre {...props} className="overflow-scroll scrollbar-none" />
  ),
  div: (props: ComponentProps<'div'>) => {
    return <div {...props} />
  },
  code: (props: ComponentProps<'code'>) => {
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

export { markdownComponents }
