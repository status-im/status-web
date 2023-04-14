import { createIcon } from '../lib/create-icon'

const SvgMaximizeWindowsIcon = createIcon(props => {
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
      <path
        stroke={props.color}
        strokeWidth={1.2}
        d="M10 4c6 0 6 0 6 6s0 6-6 6-6 0-6-6 0-6 6-6Z"
      />
    </svg>
  )
})

export default SvgMaximizeWindowsIcon
