import { createIcon } from '../lib/create-icon'

const SvgPositiveStateIcon = createIcon(props => {
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
        stroke="#23ADA0"
        strokeWidth={1.2}
        opacity={0.4}
      />
      <path stroke="#23ADA0" strokeWidth={1.2} d="m7.25 10.75 2 1.5 3.5-4.5" />
    </svg>
  )
})

export default SvgPositiveStateIcon
