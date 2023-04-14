import { createIcon } from '../lib/create-icon'

const SvgDropdownIcon = createIcon(props => {
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
        fill="#E7EAEE"
        fillRule="evenodd"
        d="M3 10a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z"
        clipRule="evenodd"
      />
      <path stroke={props.color} strokeWidth={1.2} d="m7 8.5 3 3 3-3" />
    </svg>
  )
})

export default SvgDropdownIcon
