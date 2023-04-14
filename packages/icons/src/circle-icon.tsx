import { createIcon } from '../lib/create-icon'

const SvgCircleIcon = createIcon(props => {
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
        fill="#2A4AF5"
        fillRule="evenodd"
        d="M10 3.2a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 0 0 0-13.6ZM10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z"
        clipRule="evenodd"
      />
      <path
        fill="#2A4AF5"
        fillRule="evenodd"
        d="M10 3.2a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 0 0 0-13.6Z"
        clipRule="evenodd"
        opacity={0.4}
      />
    </svg>
  )
})

export default SvgCircleIcon
