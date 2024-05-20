import { createIcon } from '../lib/create-icon'

const SvgPlayMediaIcon = createIcon(props => {
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
        fill={props.color}
        d="M7.193 16c-1.807 0-1.808-12 0-12C9 4 16.5 8.5 16.5 10S9 16 7.193 16Z"
      />
    </svg>
  )
})

export default SvgPlayMediaIcon
