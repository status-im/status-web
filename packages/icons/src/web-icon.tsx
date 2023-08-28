import { createIcon } from '../lib/create-icon'

const SvgWebIcon = createIcon(props => {
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
        d="M10 2.5c6.5 0 7.5 1 7.5 7.5s-1 7.5-7.5 7.5-7.5-1-7.5-7.5 1-7.5 7.5-7.5Z"
      />
      <path
        fill={props.color}
        fillRule="evenodd"
        d="M6.75 5.75a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm2.5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm2.5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgWebIcon
