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
        d="M10 3.625a6.375 6.375 0 1 0 0 12.75 6.375 6.375 0 0 0 0-12.75ZM10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z"
        clipRule="evenodd"
      />
      <path
        fill="#2A4AF5"
        fillRule="evenodd"
        d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z"
        clipRule="evenodd"
        opacity={0.4}
      />
    </svg>
  )
})

export default SvgCircleIcon
