import type { App } from '~/types/app'

export const featuredApps: App[] = [
  {
    id: 1,
    name: 'Cat Fishing',
    category: 'Community',
    status: 'Live',
    description: 'You love cats, cats love fish.',
    website: 'https://cats.fishing',
    twitter: 'catsfishings',
    icon: '/apps/cats-fishing-avatar.png',
    cover: '/apps/cats-fishing-cover.png',
  },
  {
    id: 2,
    name: 'Status Network Bridge',
    category: 'Bridge',
    status: 'Live',
    description: "Saving for gas? We've got you covered!",
    website: 'https://bridge.status.network',
    twitter: 'StatusL2',
    icon: '/apps/status-network-bridge-avatar.png',
    cover: '/apps/status-network-bridge-cover.png',
  },
  {
    id: 3,
    name: 'Hash Vegas',
    category: 'Gaming',
    status: 'Live',
    description: ' Fair and transparent onchain gaming',
    website: 'https://hashvegas.casino',
    twitter: 'Hashvegas_Offi',
    icon: '/apps/hashvegas-avatar.png',
    cover: '/apps/hashvegas-cover.png',
  },
]
