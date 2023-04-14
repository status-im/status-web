import { createIcon } from '../lib/create-icon'

const SvgMenuIcon = createIcon(props => {
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
        d="M3.5 4.4h13v1.2h-13V4.4Zm0 5h13v1.2h-13V9.4Zm13 5h-13v1.2h13v-1.2Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgMenuIcon
