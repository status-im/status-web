import { forwardRef } from 'react'

import NextLink from 'next/link'

import { Link as IntlLink } from '~/i18n/navigation'
import { nonLocalizedPaths } from '~/i18n/routing'

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
  const nonLocalized = nonLocalizedPaths.some(
    p => url?.startsWith(`/${p}/`) || url === `/${p}`
  )

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
