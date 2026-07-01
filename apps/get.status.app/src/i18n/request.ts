import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { mergeCmsMessages } from '../lib/cms-messages'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale =
    requested && hasLocale(routing.locales, requested)
      ? requested
      : routing.defaultLocale

  const baseMessages = (await import(`../../messages/${locale}.json`)).default

  return {
    locale,
    messages: await mergeCmsMessages(baseMessages),
  }
})
