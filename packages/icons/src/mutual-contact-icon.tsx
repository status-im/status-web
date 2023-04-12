import { createIcon } from '../lib/create-icon'

const SvgMutualContactIcon = createIcon(props => {
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
        fillOpacity={0.4}
        fillRule="evenodd"
        d="M8.958 5.723a5.5 5.5 0 1 0 0 8.554A6.97 6.97 0 0 1 7.5 10a6.97 6.97 0 0 1 1.458-4.277Z"
        clipRule="evenodd"
      />
      <circle cx={14.5} cy={10} r={5.5} fill="#2A4AF5" />
    </svg>
  )
})

export default SvgMutualContactIcon
