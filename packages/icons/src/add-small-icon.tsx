import { createIcon } from '../lib/create-icon'

const SvgAddSmallIcon = createIcon(props => {
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
      <circle cx={10} cy={10} r={7} stroke="#A1ABBD" strokeWidth={1.2} />
      <path
        fill={props.color}
        fillRule="evenodd"
        d="M10.6 9.4V6.5H9.4v2.9H6.5v1.2h2.9v2.9h1.2v-2.9h2.9V9.4h-2.9Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgAddSmallIcon
