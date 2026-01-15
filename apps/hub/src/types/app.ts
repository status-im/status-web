export type App = {
  id: number
  name: string
  nameKey?: string
  category: string
  status: string
  description: string
  descriptionKey?: string
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
