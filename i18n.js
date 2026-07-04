// i18n.js — next-intl request configuration
// Loads the right message bundle for the active locale each request.
import { getRequestConfig } from 'next-intl/server'

const SUPPORTED = ['en', 'bn']
const DEFAULT = 'en'

export default getRequestConfig(async ({ locale }) => {
  const active = SUPPORTED.includes(locale) ? locale : DEFAULT
  return {
    locale: active,
    messages: (await import(`./messages/${active}.json`)).default,
  }
})
