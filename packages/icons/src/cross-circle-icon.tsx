import { createIcon } from '../lib/create-icon'

const SvgCrossCircleIcon = createIcon(props => {
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
      <circle cx={10} cy={10} r={7.5} fill="#E95460" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="m10 10.849 2.05 2.05.849-.848-2.05-2.05 2.05-2.052-.848-.848L10 9.15 7.95 7.1l-.85.848L9.152 10l-2.05 2.05.849.85L10 10.848Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgCrossCircleIcon
