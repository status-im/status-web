import { createIcon } from '../lib/create-icon'

const SvgAddSmIcon = createIcon(props => {
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
        d="M9.4 10.6V15h1.2v-4.4H15V9.4h-4.4V5H9.4v4.4H5v1.2h4.4Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgAddSmIcon
