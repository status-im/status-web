import { createIcon } from '../lib/create-icon'

const SvgAddTokenIcon = createIcon(props => {
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
        fill="#647084"
        fillRule="evenodd"
        d="M3 10a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z"
        clipRule="evenodd"
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M9.4 10.6v2.9h1.2v-2.9h2.9V9.4h-2.9V6.5H9.4v2.9H6.5v1.2h2.9Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgAddTokenIcon
