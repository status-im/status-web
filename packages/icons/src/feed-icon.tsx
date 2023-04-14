import { createIcon } from '../lib/create-icon'

const SvgFeedIcon = createIcon(props => {
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
        d="M10 3.1a6.9 6.9 0 0 0-5.888 10.499 6.1 6.1 0 1 1 11.777 0A6.9 6.9 0 0 0 10 3.1Zm4.023 11.7a4.1 4.1 0 1 0-8.044 0 4.9 4.9 0 1 1 8.044 0Zm-4.061 2.1a2.9 2.9 0 1 1 .078 0h-.078ZM10 18.1h.07a8.1 8.1 0 1 0-.07 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgFeedIcon
