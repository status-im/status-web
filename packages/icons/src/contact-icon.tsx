import { createIcon } from '../lib/create-icon'

const SvgContactIcon = createIcon(props => {
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
      <circle cx={10} cy={10} r={7.5} fill="#2A4AF5" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M8.65 8a1.35 1.35 0 1 1 2.7 0 1.35 1.35 0 0 1-2.7 0ZM10 5.35a2.65 2.65 0 1 0 0 5.3 2.65 2.65 0 0 0 0-5.3Zm0 8.3a3.35 3.35 0 0 0-3.013 1.884 6.312 6.312 0 0 1-1.08-.744A4.649 4.649 0 0 1 10 12.35c1.768 0 3.306.987 4.092 2.44a6.311 6.311 0 0 1-1.079.744A3.35 3.35 0 0 0 10 13.65Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgContactIcon
