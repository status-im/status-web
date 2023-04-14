import { createIcon } from '../lib/create-icon'

const SvgActiveMembersIcon = createIcon(props => {
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
        d="M13.5 3.5H7l-3.5 8h5l-1.5 5 9.5-9H11l2.5-4Z"
      />
    </svg>
  )
})

export default SvgActiveMembersIcon
