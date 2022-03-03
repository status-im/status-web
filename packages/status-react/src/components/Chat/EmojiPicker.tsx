import React from 'react'

import { Picker } from 'emoji-mart'
import { useTheme } from 'styled-components'

import { useLow } from '../../contexts/narrowProvider'
import { lightTheme } from '../../styles/themes'

import type { Theme } from '~/src/types/theme'
import type { EmojiData } from 'emoji-mart'

type EmojiPickerProps = {
  showEmoji: boolean
  addEmoji: (e: EmojiData) => void
  bottom: number
}

export function EmojiPicker({ showEmoji, addEmoji, bottom }: EmojiPickerProps) {
  const theme = useTheme() as Theme
  const low = useLow()

  if (showEmoji) {
    return (
      <Picker
        onSelect={addEmoji}
        theme={theme === lightTheme ? 'light' : 'dark'}
        set="twitter"
        color={theme.tertiary}
        emojiSize={26}
        style={{
          position: 'absolute',
          bottom: `calc(100% + ${bottom}px)`,
          right: '-76px',
          color: theme.secondary,
          height: low ? '200px' : '355px',
          overflow: 'auto',
        }}
        showPreview={false}
        showSkinTones={false}
        title={''}
      />
    )
  }
  return null
}
