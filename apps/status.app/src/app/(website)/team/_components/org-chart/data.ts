import {
  CustomizeIcon,
  DesktopIcon,
  GavelIcon,
  KeycardCardIcon,
  LinkIcon,
  LockedIcon,
  MembersIcon,
  MessagesIcon,
  MobileIcon,
  NodeIcon,
  RevealIcon,
  SignatureIcon,
  StatusIconIcon,
  TokenSalesIcon,
  WalletIcon,
  WebIcon,
} from '@status-im/icons/20'

export const FOUNDERS = [
  {
    id: 1,
    name: 'Jarrad Hope',
  },
  {
    id: 2,
    name: 'Carl Bennetts',
  },
]

export const TEAM = [
  {
    id: 1,
    name: 'Legal Lead',
    icon: GavelIcon,
    children: [
      {
        id: 2,
        name: 'Legal Associate',
        count: 2,
        children: [],
      },
    ],
  },
  {
    id: 3,
    name: 'People Ops Lead',
    icon: MembersIcon,
    children: [
      {
        id: 4,
        name: 'People Partner',
        count: 2,
        children: [],
      },
      {
        id: 5,
        name: 'Recruiter',
        count: 4,
        children: [],
      },
    ],
  },
  {
    id: 6,
    name: 'Finance Lead',
    icon: TokenSalesIcon,
    children: [
      {
        id: 7,
        name: 'Finance Manager',
        children: [],
      },
      {
        id: 8,
        name: 'Analyst',
        children: [],
      },
      {
        id: 9,
        name: 'Accounting',
        count: 3,
        children: [],
      },
    ],
  },
  {
    id: 10,
    name: 'Status Lead',
    icon: StatusIconIcon,
    children: [
      {
        id: 11,
        name: 'Design Lead',
        icon: CustomizeIcon,
        children: [
          {
            id: 12,
            name: 'Product Designer',
            count: 4,
            children: [],
          },
          {
            id: 13,
            name: 'Visual Designer',
            children: [],
          },
          {
            id: 14,
            name: 'Motion Designer',
            children: [],
          },
        ],
      },
      {
        id: 15,
        name: 'Desktop Lead',
        icon: DesktopIcon,
        children: [
          {
            id: 16,
            name: 'UI Dev Lead',
            children: [
              {
                id: 17,
                name: 'Desktop Dev',
                count: 4,
                children: [],
              },
            ],
          },
          {
            id: 18,
            name: 'Msg Dev Lead',
            children: [
              {
                id: 19,
                name: 'Desktop Dev',
                count: 8,
                children: [],
              },
            ],
          },
          {
            id: 20,
            name: 'QA Lead',
            children: [
              {
                id: 21,
                name: 'QA Engineer',
                count: 2,
                children: [],
              },

              {
                id: 22,
                name: 'Test Automation',
                count: 2,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 23,
        name: 'Mobile Lead',
        icon: MobileIcon,
        children: [
          {
            id: 24,
            name: 'Mobile Dev',
            count: 17,
            children: [],
          },
          {
            id: 25,
            name: 'QA Lead',
            children: [
              {
                id: 26,
                name: 'QA Engineer',
                count: 3,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 27,
        name: 'Wallet Lead',
        icon: WalletIcon,
        children: [
          {
            id: 28,
            name: 'Desktop Dev',
            count: 6,
            children: [],
          },
          {
            id: 29,
            name: 'Mobile Lead',
            children: [
              {
                id: 26,
                name: 'Mobile Dev',
                count: 8,
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: 30,
        name: 'Web Lead',
        icon: WebIcon,
        children: [
          {
            id: 31,
            name: 'Web Dev',
            count: 3,
            children: [],
          },
        ],
      },
      {
        id: 32,
        name: 'Keycard Lead',
        icon: KeycardCardIcon,
        children: [
          {
            id: 33,
            name: 'Keycard Dev',
            children: [],
          },
        ],
      },
      {
        id: 34,
        name: 'L2 Chain Lead',
        icon: LinkIcon,
        children: [],
      },
      {
        id: 35,
        name: 'Tech Writing Lead',
        icon: SignatureIcon,
        children: [
          {
            id: 36,
            name: 'Tech Writer',
            count: 3,
            children: [],
          },
        ],
      },
      {
        id: 37,
        name: 'Product',
        icon: RevealIcon,
        children: [
          {
            id: 38,
            name: 'Product Strategy',
            children: [],
          },
          {
            id: 39,
            name: 'Project Support',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 40,
    name: 'Security Lead',
    icon: LockedIcon,
    children: [
      {
        id: 41,
        name: 'Security Engineer',
        children: [],
      },
    ],
  },
  {
    id: 42,
    name: 'Comms Lead',
    icon: MessagesIcon,
    children: [
      {
        id: 43,
        name: 'Copywriting Lead',
        children: [
          {
            id: 44,
            name: 'Copywriter',
            count: 2,
            children: [],
          },
        ],
      },
      {
        id: 45,
        name: 'Marketing Lead',
        children: [
          {
            id: 46,
            name: 'Marketer',
            count: 2,
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 47,
    name: 'Infra Lead',
    icon: NodeIcon,
    children: [
      {
        id: 48,
        name: 'DevOps Engineer',
        count: 2,
        children: [],
      },
    ],
  },
]
