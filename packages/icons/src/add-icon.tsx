import { createIcon } from '../lib/create-icon'

const SvgAddIcon = createIcon(props => {
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
        d="M9.4 10.6v5.9h1.2v-5.9h5.9V9.4h-5.9V3.5H9.4v5.9H3.5v1.2h5.9Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgAddIcon
