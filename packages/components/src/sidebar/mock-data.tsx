import { Basketball, Collaboration, Fire, Peach, Play, Unicorn } from '../emoji'

export interface Channel {
  id: string
  title: string
  description: string
  icon?: React.ReactNode
  channelStatus?: 'muted' | 'normal' | 'withMessages' | 'withMentions'
  numberOfMessages?: number
}

export interface ChannelGroup {
  id: string
  title: string
  unreadCount?: number
  channels: Channel[]
}

// MOCK DATA
export const CHANNEL_GROUPS: ChannelGroup[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    unreadCount: 3,
    channels: [
      {
        id: 'welcome',
        title: '# welcome',
        icon: <Collaboration hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'general-welcome',
        title: '# general',
        icon: <Play hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'random',
        title: '# random',
        icon: <Fire hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'onboarding',
        title: '# onboarding',
        icon: <Unicorn hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
        channelStatus: 'withMentions',
        numberOfMessages: 3,
      },
    ],
  },
  {
    id: 'community',
    title: 'Community',
    unreadCount: 5,
    channels: [
      {
        id: 'announcements',
        title: '# announcements',
        icon: <Peach hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'jobs',
        title: '# jobs',
        channelStatus: 'withMentions',
        numberOfMessages: 3,
        icon: <Play hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'events',
        title: '# events',
        channelStatus: 'withMentions',
        numberOfMessages: 2,
        icon: <Fire hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'meetups',
        title: '# meetups',
        icon: <Unicorn hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
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
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'ux',
        title: '# ux',
        icon: <Play hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'ui',
        title: '# ui',
        icon: <Fire hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'figma',
        title: '# figma',
        icon: <Unicorn hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
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
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'people-ops',
        title: '# people-ops',
        icon: <Basketball hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
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
        description: 'Share random funny stuff with the community. Play nice.',
        channelStatus: 'withMessages',
      },
      {
        id: 'vue',
        title: '# vue',
        icon: <Play hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'angular',
        title: '# angular',
        channelStatus: 'muted',
        icon: <Fire hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'svelte',
        title: '# svelte',
        icon: <Unicorn hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
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
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'python',
        title: '# python',
        icon: <Play hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'ruby',
        title: '# ruby',
        icon: <Fire hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'php',
        title: '# php',
        channelStatus: 'muted',
        icon: <Unicorn hasBackground />,
        description: 'Share random funny stuff with the community. Play nice.',
      },
    ],
  },
]
