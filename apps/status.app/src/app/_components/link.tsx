import { forwardRef } from 'react'

import NextLink from 'next/link'

import { Link as IntlLink } from '~/i18n/navigation'

const Link = (
  props: React.ComponentPropsWithRef<typeof NextLink>,
  ref: React.Ref<HTMLAnchorElement>
) => {
  const { locale, ...restProps } = props
  const url =
    typeof restProps.href === 'string'
      ? restProps.href
      : restProps.href.pathname!
  const external = url?.startsWith('http') || url?.startsWith('/api')
  const nonLocalized =
    url?.startsWith('/admin') ||
    url?.startsWith('/c') ||
    url?.startsWith('/cc') ||
    url?.startsWith('/u') ||
    url?.startsWith('/rss') ||
    url?.startsWith('/mobile-news') ||
    url?.startsWith('/desktop-news')

  if (external) {
    return (
      <a
        {...restProps}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        ref={ref}
      >
        {restProps.children}
      </a>
    )
  }

  if (nonLocalized || locale === false) {
    return <NextLink {...props} ref={ref} />
  }

  return (
    <IntlLink
      {...restProps}
      locale={typeof locale === 'string' ? locale : undefined}
      ref={ref}
    />
  )
}

const _Link = forwardRef(Link)

export { _Link as Link }
