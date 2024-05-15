import { createIcon } from '../lib/create-icon'

const SvgNeutralIcon = createIcon(props => {
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
      <circle cx={10} cy={10} r={7.5} fill={props.color} />
      <path stroke="#fff" strokeWidth={1.2} d="M7 10h6" />
    </svg>
  )
})

export default SvgNeutralIcon
