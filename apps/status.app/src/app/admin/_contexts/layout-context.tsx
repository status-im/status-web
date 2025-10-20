'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import Inspect from 'inspx'
import {
  usePathname,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
} from 'next/navigation'

import { useLocalStorage } from '~hooks/use-local-storage'
import { useMediaQuery } from '~hooks/use-media-query'

const WHITE_LISTED_PATHS = [
  '/admin/insights/epics',
  '/admin/insights/releases',
  '/admin/insights/workstreams',
  '/admin/insights/projects',
  '/admin/keycard/devices',
  '/admin/keycard/dashboard',
  '/admin/keycard/databases',
  '/admin/keycard/firmwares',
]

const SEGMENTS_TO_USE_PARENT_SEGMENT = ['users']
// Function to check if the pathname corresponds to a dynamic route
const isDynamicRoute = (path: string) => {
  const detailedReportingRoutePattern = /^\/admin\/reporting\/\d+\/\d+$/
  if (detailedReportingRoutePattern.test(path)) {
    return true
  }

  return !WHITE_LISTED_PATHS.some(route => path === route)
}

interface LayoutContextProps {
  isLeftViewVisible: boolean
  showRightView: () => void
  isExpanded: boolean
  sideNavExpanded: boolean
  toggleExpandedState: () => void
  toggleSideNav: () => void
}

const LayoutContext = createContext<LayoutContextProps>({
  isLeftViewVisible: false,
  isExpanded: false,
  sideNavExpanded: false,
  toggleExpandedState: () => {
    // do nothing
  },
  showRightView: () => {
    // do nothing
  },
  toggleSideNav: () => {
    // do nothing
  },
})

// Segments that can be expanded
export type Segments =
  | 'devices'
  | 'databases'
  | 'firmwares'
  | 'releases'
  | 'workstreams'
  | 'epics'
  | 'projects'
  | 'reports'

type RootSegment = 'epics'

type SegmentExpandedState = Record<Segments, boolean>

export const useLayoutContext = () => useContext(LayoutContext)

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLeftViewVisible, setIsLeftViewVisible] = useState(true)
  const [sideNavExpanded, setSideNavExpanded] = useState(true)
  const [expandedState, setExpandedState] =
    useLocalStorage<SegmentExpandedState>('expandedState', {
      workstreams: false,
      releases: false,
      devices: false,
      databases: false,
      firmwares: false,
      epics: false,
      projects: false,
      reports: false,
    })

  const matchesUltraLargeDesktop = useMediaQuery('4xl') || false

  const segments = useSelectedLayoutSegments()!
  const rootSegment = useSelectedLayoutSegment() as RootSegment

  const [, ...segmentsWithoutRoot] = segments

  const segmentInUse = SEGMENTS_TO_USE_PARENT_SEGMENT.some(
    segment => segment === rootSegment
  )
    ? rootSegment
    : (segmentsWithoutRoot[0] as Segments)

  const isExpanded = expandedState[segmentInUse]

  const toggleExpandedState = () => {
    setExpandedState({
      ...expandedState,
      [segmentInUse]: !expandedState[segmentInUse],
    })
  }

  const pathname = usePathname()

  const showRightView = () => {
    setIsLeftViewVisible(false)
  }

  const toggleSideNav = () => {
    setSideNavExpanded(!sideNavExpanded)
  }

  // Reset the layout context when the user navigates to a new page if it clicks on the navbar not on a dynamic link
  useEffect(() => {
    const isDynamic = isDynamicRoute(pathname || '')

    if (!isDynamic && !isLeftViewVisible) {
      setIsLeftViewVisible(true)
    }

    if (isDynamic && isLeftViewVisible) {
      setIsLeftViewVisible(false)
    }

    // Special cases
    const summaryReportingRoutePattern = /^\/admin\/reporting\/\d+$/
    const detailedReportingRoutePattern = /^\/admin\/reporting\/\d+\/\d+$/

    if (summaryReportingRoutePattern.test(pathname || '')) {
      setIsLeftViewVisible(true)
    }

    if (detailedReportingRoutePattern.test(pathname || '')) {
      setIsLeftViewVisible(false)
    }
  }, [pathname, isLeftViewVisible])

  const isExpandedAndMatchesUltraLargeDesktop =
    isExpanded && matchesUltraLargeDesktop

  return (
    <LayoutContext.Provider
      value={{
        isLeftViewVisible,
        showRightView,
        isExpanded: isExpandedAndMatchesUltraLargeDesktop,
        toggleExpandedState,
        toggleSideNav,
        sideNavExpanded,
      }}
    >
      <Inspect>
        <>{children}</>
      </Inspect>
    </LayoutContext.Provider>
  )
}
