import { createIcon } from '../lib/create-icon'

const SvgSearchIcon = createIcon(props => {
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
        d="M3.1 9a5.9 5.9 0 1 1 11.8 0A5.9 5.9 0 0 1 3.1 9ZM9 1.9a7.1 7.1 0 1 0 4.579 12.527l3.497 3.497.848-.848-3.497-3.498A7.1 7.1 0 0 0 9 1.9Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgSearchIcon
