import { createIcon } from '../lib/create-icon'

const SvgFocusIcon = createIcon(props => {
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
        d="M3.6 10a6.4 6.4 0 1 1 12.8 0 6.4 6.4 0 0 1-12.8 0ZM10 2.4a7.6 7.6 0 1 0 0 15.2 7.6 7.6 0 0 0 0-15.2ZM6.6 10a3.4 3.4 0 1 1 6.8 0 3.4 3.4 0 0 1-6.8 0ZM10 5.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgFocusIcon
