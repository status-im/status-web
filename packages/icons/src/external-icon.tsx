import { createIcon } from '../lib/create-icon'

const SvgExternalIcon = createIcon(props => {
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
        d="M11.551 7.6H7V6.4h6.6V13h-1.2V8.449l-6.476 6.475-.848-.848L11.55 7.6Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgExternalIcon
