import base from '@sindresorhus/slugify'

export function slugify(value: string): string {
  return base(value, { separator: '-' })
}
