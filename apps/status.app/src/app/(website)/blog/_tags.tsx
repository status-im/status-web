import { clientEnv } from '~/config/env.client.mjs'
import { Icon } from '~components/assets/icon'

export const TAGS =
  clientEnv.NEXT_PUBLIC_VERCEL_ENV === 'production' ||
  clientEnv.NEXT_PUBLIC_VERCEL_ENV === 'preview'
    ? {
        news: {
          id: '63b48c62fc2070000104be8c',
          slug: 'news',
          name: 'News',
          icon: (
            <Icon id="Blog/Icons/01_News_and_Announcements:192:192" size={20} />
          ),
        },
        product: {
          id: '63b48c62fc2070000104bea2',
          slug: 'product',
          name: 'Product',
          icon: <Icon id="Blog/Icons/02_Product:192:192" size={20} />,
        },
        developers: {
          id: '63b48c62fc2070000104be61',
          slug: 'developers',
          name: 'Developers',
          icon: <Icon id="Blog/Icons/03_Developers:192:192" size={20} />,
        },
        'privacy-security': {
          id: '63b48c62fc2070000104bea4',
          slug: 'privacy-security',
          name: 'Privacy & Security',
          icon: (
            <Icon id="Blog/Icons/04_Privacy_and_Security:192:192" size={20} />
          ),
        },
        dapps: {
          id: '63b48c62fc2070000104be60',
          slug: 'dapps',
          name: 'Dapps',
          icon: <Icon id="Blog/Icons/05_Dapps:192:192" size={20} />,
        },
        community: {
          id: '63b48c62fc2070000104be64',
          slug: 'community',
          name: 'Community',
          icon: <Icon id="Blog/Icons/06_Community:192:192" size={20} />,
        },
        keycard: {
          id: '63b48c62fc2070000104be64',
          slug: 'keycard',
          name: 'Keycard',
          icon: <Icon id="Blog/Icons/07_Keycard:192:192" size={20} />,
        },
      }
    : {
        'getting-started': {
          id: '59799bbd6ebb2f00243a33db',
          slug: 'getting-started',
          name: 'Getting Started',
          icon: (
            <Icon id="Blog/Icons/01_News_and_Announcements:192:192" size={20} />
          ),
        },
        fables: {
          id: '5979a779df093500228e958a',
          slug: 'fables',
          name: 'Fables',
          icon: <Icon id="Blog/Icons/02_Product:192:192" size={20} />,
        },
        speeches: {
          id: '5979a779df093500228e958b',
          slug: 'speeches',
          name: 'Speeches',
          icon: <Icon id="Blog/Icons/03_Developers:192:192" size={20} />,
        },
      }

export type SLUGS = keyof typeof TAGS
