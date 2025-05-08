export const DEFAULT_SORT = {
  assets: { column: 'name', direction: 'asc' as const },
  collectibles: { column: 'name', direction: 'asc' as const },
} as const

export const SORT_OPTIONS = {
  assets: {
    name: 'Name',
    balance: 'Balance',
    '24h': '24H%',
    value: 'Value',
    price: 'Price',
  },
  collectibles: {
    name: 'Name',
    collection: 'Collection',
  },
} as const

export const GRADIENTS = [
  'linear-gradient(120deg, #F6B03C, #1992D7, #7140FD)',
  'linear-gradient(190deg, #FF7D46, #7140FD, #2A4AF5)',
  'linear-gradient(145deg, #2A4AF5, #EC266C, #F6B03C)',
  'linear-gradient(195deg, #216266, #FF7D46, #2A4AF5)',
  'linear-gradient(45deg, #7140FD, #216266, #F6B03C)',
  'linear-gradient(145deg, #F6B03C, #1992D7, #7140FD)',
  'linear-gradient(45deg, #F6B03C, #1992D7, #7140FD)',
  'linear-gradient(145deg, #FF7D46, #7140FD, #2A4AF5)',
  'linear-gradient(45deg, #2A4AF5, #EC266C, #F6B03C)',
  'linear-gradient(125deg, #216266, #FF7D46, #2A4AF5)',
  'linear-gradient(145deg, #F6B03C, #1992D7, #7140FD)',
  'linear-gradient(145deg, #F6B03C, #1992D7, #7140FD)',
]
