import { createIcon } from '../lib/create-icon'

const SvgChevronTopIcon = createIcon(props => {
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
      <path stroke={props.color} strokeWidth={1.2} d="M5.5 12 10 7.5l4.5 4.5" />
    </svg>
  )
})

export default SvgChevronTopIcon
