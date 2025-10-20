import { forwardRef } from 'react'

import NextLink from 'next/link'

const Link = (
  props: React.ComponentPropsWithRef<typeof NextLink>,
  ref: React.Ref<HTMLAnchorElement>
) => {
  const url = typeof props.href === 'string' ? props.href : props.href.pathname!
  const external = url?.startsWith('http') || url?.startsWith('/api')

  if (external) {
    return (
      <a
        {...props}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        ref={ref}
      >
        {props.children}
      </a>
    )
  }

  return <NextLink {...props} ref={ref} />
}

const _Link = forwardRef(Link)

export { _Link as Link }
