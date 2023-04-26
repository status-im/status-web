import { useEffect, useRef, useState } from 'react'

import { AudioVisualizer } from './audio-visualizer'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof AudioVisualizer> = {
  component: AudioVisualizer,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/qSIh8wh9EVdY8S2sZce15n/Composer-for-Web?node-id=7131%3A360528&t=11hKj5jyWVroXgdu-4',
    },
  },
  decorators: [
    Story => {
      const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
      const audioContentRef = useRef<AudioContext | null>(null)

      useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          const AudioContext = window.AudioContext
          audioContentRef.current = new AudioContext()
          const streamSource =
            audioContentRef.current.createMediaStreamSource(stream)

          const analyzer = audioContentRef.current.createAnalyser()

          analyzer.fftSize = 256
          streamSource.connect(analyzer)

          setAnalyser(analyzer)
        })

        return () => {
          audioContentRef.current?.close()
        }
      }, [])

      return (
        <Story
          args={{
            analyser,
            width: 400,
          }}
        />
      )
    },
  ],
}

type Story = StoryObj<typeof AudioVisualizer>

export const Default: Story = {
  name: 'AudioVisualizer',
  args: {},
}

export default meta
