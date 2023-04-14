import { createIcon } from '../lib/create-icon'

const SvgRevereIcon = createIcon(props => {
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
        d="M7.36 3.625a6.9 6.9 0 1 1-3.336 9.825l-1.039.6A8.1 8.1 0 1 0 4.1 4.45V3H2.9v4.1H7V5.9H4.45a6.9 6.9 0 0 1 2.91-2.275Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgRevereIcon
