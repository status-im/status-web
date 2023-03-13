export interface Channel {
  id: string
  title: string
  description: string
  emoji: string
  channelStatus?: 'muted' | 'normal' | 'withMessages' | 'withMentions'
  numberOfMessages?: number
}

export interface ChannelGroup {
  id: string
  title: string
  unreadCount?: number
  channels: Channel[]
}

const emojis = ['👋', '🔥', '🦄', '🍑', '🤫', '🫣', '🏀', '🤝']

const randomEmoji = () => emojis[Math.floor(Math.random() * emojis.length)]

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
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'general-welcome',
        title: '# general',
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'random',
        title: '# random',
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'onboarding',
        title: '# onboarding',
        emoji: randomEmoji(),
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
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'jobs',
        title: '# jobs',
        channelStatus: 'withMentions',
        numberOfMessages: 3,
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'events',
        title: '# events',
        channelStatus: 'withMentions',
        numberOfMessages: 2,
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'meetups',
        title: '# meetups',
        emoji: randomEmoji(),
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
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'ux',
        title: '# ux',
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'ui',
        title: '# ui',
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'figma',
        title: '# figma',
        emoji: randomEmoji(),
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
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'people-ops',
        title: '# people-ops',
        emoji: randomEmoji(),
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
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
        channelStatus: 'withMessages',
      },
      {
        id: 'vue',
        title: '# vue',
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'angular',
        title: '# angular',
        channelStatus: 'muted',
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'svelte',
        title: '# svelte',
        emoji: randomEmoji(),
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
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'python',
        title: '# python',
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'ruby',
        title: '# ruby',
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
      {
        id: 'php',
        title: '# php',
        channelStatus: 'muted',
        emoji: randomEmoji(),
        description: 'Share random funny stuff with the community. Play nice.',
      },
    ],
  },
]
