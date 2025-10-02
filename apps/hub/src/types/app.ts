export type App = {
  id: number
  name: string
  category: string
  status: string
  description: string
  website: string
  twitter?: string
  cover: string
  icon: string
  isPopular?: boolean
  isNew?: boolean
}

export type Category = {
  id: string
  label: string
}

export type Tab = {
  id: 'popular' | 'new' | 'all'
  label: string
}
