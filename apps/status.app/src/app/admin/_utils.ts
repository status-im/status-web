import { format } from 'date-fns'

import type { Segments } from '~admin/_contexts/layout-context'
import type { ApiOutput } from '~server/api/types'

// Format number with separators
export const formatNumber = (number = 0) => number.toLocaleString('en-US')

export const shortDate = (date: Date) => format(date, 'dd/MM/yy')

export const checkEditPermissions = (
  segment: Segments,
  user: ApiOutput['user']
): boolean => {
  switch (segment) {
    case 'workstreams':
    case 'epics':
    case 'projects':
    case 'releases': {
      return user.canEditInsights
    }
    case 'firmwares':
    case 'databases':
    case 'devices': {
      return user.canEditKeycard
    }
    default: {
      return false
    }
  }
}

export const matchesSearchFilter = (word: string, searchFilter: string) => {
  return word.toLowerCase().includes(searchFilter.toLowerCase())
}

export const pluralize = (count: number, word: string, suffix = 's') => {
  return `${count} ${word}${count !== 1 ? suffix : ''}`
}
