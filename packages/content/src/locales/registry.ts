import { type Language, languageSchema } from '../schemas/common'

/**
 * Active locale registry.
 *
 * The active locale list mirrors `routing.locales` from
 * `apps/web/i18n/routing.ts`. Apps bootstrap the registry once at startup
 * (`setActiveLocales(routing.locales)`) so the content package can decide
 * which `<locale>.json` files are required and which are ignored.
 *
 * The default value matches the current shipping locale set so package-level
 * tooling works without bootstrap. When `routing.ts` adds a locale, the app
 * is responsible for calling `setActiveLocales` — a missing call would let
 * the validation step quietly skip the new locale.
 */
const DEFAULT_ACTIVE_LOCALES: readonly Language[] = ['en']

let activeLocales: readonly Language[] = DEFAULT_ACTIVE_LOCALES

export const setActiveLocales = (locales: readonly Language[]): void => {
  if (locales.length === 0) {
    throw new Error('at least one active locale is required')
  }
  for (const locale of locales) {
    languageSchema.parse(locale)
  }
  activeLocales = [...locales]
}

export const getActiveLocales = (): readonly Language[] => activeLocales

export const isActiveLocale = (value: string): value is Language => {
  return (activeLocales as readonly string[]).includes(value)
}

export const assertActiveLocale = (locale: Language): void => {
  if (!isActiveLocale(locale)) {
    throw new Error(
      `locale "${locale}" is not active; active locales are [${activeLocales.join(', ')}]`
    )
  }
}
