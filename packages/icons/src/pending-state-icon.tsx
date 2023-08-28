import { createIcon } from '../lib/create-icon'

const SvgPendingStateIcon = createIcon(props => {
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
      <circle
        cx={10}
        cy={10}
        r={7}
        stroke={props.color}
        strokeWidth={1.2}
        opacity={0.4}
      />
      <path stroke={props.color} strokeWidth={1.2} d="m13 12-3-1.5V7" />
    </svg>
  )
})

export default SvgPendingStateIcon
