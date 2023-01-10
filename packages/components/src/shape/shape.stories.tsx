import { Shape } from './shape'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
export default {
  title: 'Example/Shape',
  component: Shape,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' }
  }
}

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: 'Shape'
  }
}

export const Secondary = {
  args: {
    label: 'Shape'
  }
}

export const Large = {
  args: {
    size: 'large',
    label: 'Shape'
  }
}

export const Small = {
  args: {
    size: 'small',
    label: 'Shape'
  }
}
