import { createIcon } from '../lib/create-icon'

const SvgCheckIcon = createIcon(props => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      fill="none"
      viewBox="0 0 20 20"
      focusable={false}
      aria-hidden={true}
    >
      <path stroke={props.color} strokeWidth={1.2} d="m4.5 11 4 3.5 7-9.5" />
    </svg>
  )
})

export default SvgCheckIcon
