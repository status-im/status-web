import { createIcon } from '../lib/create-icon'

const SvgDestroyIcon = createIcon(props => {
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
        stroke={props.color}
        strokeWidth={1.2}
        d="M11.2 6.976 10 3 8.5 6.5 6 5l1 3H2.5l4.06 2.548L3.5 13.5l4-.5-.5 4 3.04-3.476L13 16l-.06-3.071L17 14l-3.48-3.452L17.5 8h-3.98l.98-4.5-3.3 3.476Z"
      />
    </svg>
  )
})

export default SvgDestroyIcon
