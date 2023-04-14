import { createIcon } from '../lib/create-icon'

const SvgFlagIcon = createIcon(props => {
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
        d="M4.6 3.9V2.5H3.4v15h1.2v-5.9h3.8v1.5h8.2V5.4h-5V3.9h-7Zm0 1.2v5.3h5v1.5h5.8V6.6h-5V5.1H4.6Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgFlagIcon
