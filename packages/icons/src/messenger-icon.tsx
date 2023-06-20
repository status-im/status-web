import { createIcon } from '../lib/create-icon'

const SvgMessengerIcon = createIcon(props => {
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
        d="M1.9 8.5a6.6 6.6 0 0 1 6.6-6.6h2.638a6.962 6.962 0 0 1 3.53 12.962l-5.364 3.155-.904.532V15.1a6.6 6.6 0 0 1-6.5-6.6Zm6.6-5.4a5.4 5.4 0 0 0 0 10.8h1.1v2.551l4.46-2.623A5.761 5.761 0 0 0 11.138 3.1H8.5ZM7 6.4h6v1.2H7V6.4Zm4.5 3H7v1.2h4.5V9.4Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgMessengerIcon
