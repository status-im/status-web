export * from '../../../status.app/src/config/routes'

export const ROUTES = {
  apps: [
    { nameKey: 'desktop', href: '/apps#desktop' },
    { nameKey: 'mobile', href: '/apps#mobile' },
  ],
} as const

export type Routes = (typeof ROUTES)[keyof typeof ROUTES]
