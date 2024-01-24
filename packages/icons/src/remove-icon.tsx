import { createIcon } from '../lib/create-icon'

const SvgRemoveIcon = createIcon(props => {
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
        d="M16.5 10.6h-13V9.4h13v1.2Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgRemoveIcon
