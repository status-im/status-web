import { createIcon } from '../lib/create-icon'

const SvgDragIcon = createIcon(props => {
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
        d="M4.5 5.4h11v1.2h-11V5.4Zm0 4h11v1.2h-11V9.4Zm11 4h-11v1.2h11v-1.2Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgDragIcon
