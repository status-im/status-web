import { getRequestConfig } from 'next-intl/server'

import messages from '../../messages/en.json'
import { routing } from './routing'

export default getRequestConfig(() => ({
  locale: routing.defaultLocale,
  messages,
}))
