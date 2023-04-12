import { createIcon } from '../lib/create-icon'

const SvgReplyIcon = createIcon(props => {
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
        d="m7.048 13.395-3.5-4L3.202 9l.346-.395 3.5-4 .903.79L5.321 8.4H10c2.55 0 4.297.505 5.348 1.857C16.363 11.56 16.6 13.509 16.6 16h-1.2c0-2.509-.263-4.061-.999-5.007C13.703 10.095 12.45 9.6 10 9.6H5.322l2.63 3.005-.904.79Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgReplyIcon
