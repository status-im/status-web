import { getPageCopy } from '@status-im/content/loaders'
import { isActiveLocale } from '@status-im/content/locales'

import { cloudinaryLoader } from '../app/_components/assets/loader'

import type { Metadata } from 'next'

const GET_SITE_OG_IMAGE = cloudinaryLoader({
  src: 'get.status.app/Hero_app',
  width: 1200,
})

type RouteParams = { params: Promise<{ locale: string }> }

/**
 * Build a Next.js `generateMetadata` export bound to a CMS page route.
 */
export function createPageMetadata(route: string) {
  return async function generateMetadata({
    params,
  }: RouteParams): Promise<Metadata> {
    const { locale } = await params
    if (!isActiveLocale(locale)) {
      throw new Error(`generateMetadata received non-active locale "${locale}"`)
    }

    const page = await getPageCopy(route, locale)
    const title = page.seo?.metaTitle ?? page.title
    const description = page.seo?.metaDescription ?? page.description
    const canonical = route === '/' ? '/' : route
    const url = `https://get.status.app${canonical === '/' ? '' : canonical}`

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        type: 'website',
        url,
        title,
        description,
        siteName: 'Status App',
        images: [{ url: GET_SITE_OG_IMAGE }],
      },
    }
  }
}
