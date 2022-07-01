import { styled } from '../../styles/config'

const Box = styled('div', {
  boxSizing: 'border-box',
})

export { Box }
export type BoxProps = React.ComponentProps<typeof Box>
