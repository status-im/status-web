import { createIcon } from '../lib/create-icon'

const SvgDurationIcon = createIcon(props => {
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
        fillRule="evenodd"
        d="M8 3.1h1.4v.825a7.1 7.1 0 1 0 1.2 0V3.1H12V1.9H8v1.2ZM4.1 11a5.9 5.9 0 1 1 11.8 0 5.9 5.9 0 0 1-11.8 0Zm6.36.884 2.5-3-.921-.768-2.5 3 .922.768Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgDurationIcon
