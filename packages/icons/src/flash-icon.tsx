import { createIcon } from '../lib/create-icon'

const SvgFlashIcon = createIcon(props => {
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
        d="M11 8.5v-5l-7 8h5v5l7-8h-5Z"
      />
    </svg>
  )
})

export default SvgFlashIcon
