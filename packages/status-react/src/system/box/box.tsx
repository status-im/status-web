import { styled } from '~/src/styles/config'

const Box = styled('div', {
  boxSizing: 'border-box',
})

export { Box }
export type BoxProps = React.ComponentProps<typeof Box>
