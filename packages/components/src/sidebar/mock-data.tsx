import { Basketball, Collaboration, Fire, Peach, Play, Unicorn } from '../emoji'

interface Channels {
  id: string
  title: string
  icon?: React.ReactNode
  channelStatus?: 'muted' | 'normal' | 'withMessages' | 'withMentions'
  numberOfMessages?: number
}

export interface CommunityProps {
  id: string
  title: string
  numberOfNewMessages?: number
  channels: Channels[]
}

// MOCK DATA
export const COMMUNITIES: CommunityProps[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    numberOfNewMessages: 3,
    channels: [
      {
        id: 'welcome',
        title: '# welcome',
        icon: <Collaboration hasBackground />,
      },
      {
        id: 'general-welcome',
        title: '# general',
        icon: <Play hasBackground />,
      },
      {
        id: 'random',
        title: '# random',
        icon: <Fire hasBackground />,
      },
      {
        id: 'onboarding',
        title: '# onboarding',
        icon: <Unicorn hasBackground />,
        channelStatus: 'withMentions',
        numberOfMessages: 3,
      },
    ],
  },
  {
    id: 'community',
    title: 'Community',
    numberOfNewMessages: 5,
    channels: [
      {
        id: 'announcements',
        title: '# announcements',
        icon: <Peach hasBackground />,
      },
      {
        id: 'jobs',
        title: '# jobs',
        channelStatus: 'withMentions',
        numberOfMessages: 3,
        icon: <Play hasBackground />,
      },
      {
        id: 'events',
        title: '# events',
        channelStatus: 'withMentions',
        numberOfMessages: 2,
        icon: <Fire hasBackground />,
      },
      {
        id: 'meetups',
        title: '# meetups',
        icon: <Unicorn hasBackground />,
      },
    ],
  },
  {
    id: 'design',
    title: 'Design',
    channels: [
      {
        id: 'design',
        title: '# design',
        icon: <Collaboration hasBackground />,
      },
      {
        id: 'ux',
        title: '# ux',
        icon: <Play hasBackground />,
      },
      {
        id: 'ui',
        title: '# ui',
        icon: <Fire hasBackground />,
      },
      {
        id: 'figma',
        title: '# figma',
        icon: <Unicorn hasBackground />,
      },
    ],
  },
  {
    id: 'General',
    title: 'General',
    channels: [
      {
        id: 'general',
        title: '# general',
        icon: <Collaboration hasBackground />,
      },
      {
        id: 'people-ops',
        title: '# people-ops',
        icon: <Basketball hasBackground />,
      },
    ],
  },
  {
    id: 'Frontend',
    title: 'Frontend',
    channels: [
      {
        id: 'react',
        title: '# react',
        icon: <Collaboration hasBackground />,
        channelStatus: 'withMessages',
      },
      {
        id: 'vue',
        title: '# vue',
        icon: <Play hasBackground />,
      },
      {
        id: 'angular',
        title: '# angular',
        channelStatus: 'muted',
        icon: <Fire hasBackground />,
      },
      {
        id: 'svelte',
        title: '# svelte',
        icon: <Unicorn hasBackground />,
      },
    ],
  },
  {
    id: 'Backend',
    title: 'Backend',
    channels: [
      {
        id: 'node',
        title: '# node',
        icon: <Collaboration hasBackground />,
      },
      {
        id: 'python',
        title: '# python',
        icon: <Play hasBackground />,
      },
      {
        id: 'ruby',
        title: '# ruby',
        icon: <Fire hasBackground />,
      },
      {
        id: 'php',
        title: '# php',
        channelStatus: 'muted',
        icon: <Unicorn hasBackground />,
      },
    ],
  },
]
