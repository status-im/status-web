import { InsightsAppIcon } from '~admin/insights/_components/insights-app-icon'
import { InsightsStatusIcon } from '~admin/insights/_components/insights-status-icon'

import type { MultiselectOption } from '~admin/_components/multiselect-filter'
import type { Segments } from '~admin/_contexts/layout-context'
import type { SelectProps } from '~components/forms/select'
import type { ApiOutput } from '~server/api/types'

type AdminTranslator = (key: string) => string

type App = ApiOutput['projects']['byId']['app']
type Status = ApiOutput['projects']['byId']['status']
type Platform = ApiOutput['releases']['byId']['platform']
type SearchSegment = Segments | 'milestones'

const appLabelKeys: Record<App, string> = {
  shell: 'appShell',
  communities: 'appCommunities',
  messenger: 'appMessenger',
  wallet: 'appWallet',
  browser: 'appBrowser',
  node: 'appNode',
}

const statusLabelKeys: Record<Status, string> = {
  'not-started': 'statusNotStarted',
  'in-progress': 'statusInProgress',
  paused: 'statusPaused',
  done: 'statusDone',
}

const platformLabelKeys: Record<Platform, string> = {
  desktop: 'platformDesktop',
  mobile: 'platformMobile',
}

const segmentPluralKeys: Record<SearchSegment, string> = {
  devices: 'devicesLowercasePlural',
  databases: 'databasesLowercase',
  firmwares: 'firmwaresLowercase',
  releases: 'releasesLowercase',
  workstreams: 'workstreamsLowercase',
  epics: 'epicsLowercase',
  projects: 'projectsLowercase',
  reports: 'reportsLowercase',
  milestones: 'milestonesLowercase',
}

const segmentCountKeys: Record<SearchSegment, string> = {
  devices: 'deviceCount',
  databases: 'databaseCount',
  firmwares: 'firmwareCount',
  releases: 'releaseCount',
  workstreams: 'workstreamCount',
  epics: 'epicCount',
  projects: 'projectCount',
  reports: 'reportCount',
  milestones: 'milestoneCount',
}

export const getAdminAppLabel = (t: AdminTranslator, app: App) =>
  t(appLabelKeys[app])

export const getAdminStatusLabel = (t: AdminTranslator, status: Status) =>
  t(statusLabelKeys[status])

export const getAdminPlatformLabel = (t: AdminTranslator, platform: Platform) =>
  t(platformLabelKeys[platform])

export const getAdminSegmentPluralLabel = (
  t: AdminTranslator,
  segment: SearchSegment
) => t(segmentPluralKeys[segment])

export const getAdminSegmentCountKey = (segment: SearchSegment) =>
  segmentCountKeys[segment]

export const getProjectAppOptions = (
  t: AdminTranslator
): MultiselectOption[] => [
  {
    id: 'shell',
    label: getAdminAppLabel(t, 'shell'),
    icon: <InsightsAppIcon type="shell" />,
  },
  {
    id: 'communities',
    label: getAdminAppLabel(t, 'communities'),
    icon: <InsightsAppIcon type="communities" />,
  },
  {
    id: 'messenger',
    label: getAdminAppLabel(t, 'messenger'),
    icon: <InsightsAppIcon type="messenger" />,
  },
  {
    id: 'wallet',
    label: getAdminAppLabel(t, 'wallet'),
    icon: <InsightsAppIcon type="wallet" />,
  },
  {
    id: 'browser',
    label: getAdminAppLabel(t, 'browser'),
    icon: <InsightsAppIcon type="browser" />,
  },
  {
    id: 'node',
    label: getAdminAppLabel(t, 'node'),
    icon: <InsightsAppIcon type="node" />,
  },
]

export const getProjectAppSelectOptions = (
  t: AdminTranslator
): SelectProps['options'] =>
  getProjectAppOptions(t).map(option => ({
    value: option.id,
    label: option.label,
    icon: option.icon,
  }))

export const getProjectStatusOptions = (
  t: AdminTranslator
): MultiselectOption[] => [
  {
    id: 'not-started',
    label: getAdminStatusLabel(t, 'not-started'),
    icon: <InsightsStatusIcon status="not-started" />,
  },
  {
    id: 'in-progress',
    label: getAdminStatusLabel(t, 'in-progress'),
    icon: <InsightsStatusIcon status="in-progress" />,
  },
  {
    id: 'done',
    label: getAdminStatusLabel(t, 'done'),
    icon: <InsightsStatusIcon status="done" />,
  },
  {
    id: 'paused',
    label: getAdminStatusLabel(t, 'paused'),
    icon: <InsightsStatusIcon status="paused" />,
  },
]

export const getEpicStatusSelectOptions = (
  t: AdminTranslator
): SelectProps['options'] =>
  getProjectStatusOptions(t)
    .filter(option => option.id !== 'paused')
    .map(option => ({
      value: option.id,
      label: option.label,
      icon: option.icon,
    }))

export const getPlatformOptions = (t: AdminTranslator) => [
  {
    id: 'desktop' as const,
    label: `🌍 ${getAdminPlatformLabel(t, 'desktop')}`,
  },
  { id: 'mobile' as const, label: `📱 ${getAdminPlatformLabel(t, 'mobile')}` },
]
