import { createIcon } from '../lib/create-icon'

const SvgStopMediaIcon = createIcon(props => {
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
        d="M10 4c5.5 0 6 .5 6 6s-.5 6-6 6-6-.5-6-6 .5-6 6-6Z"
      />
    </svg>
  )
})

export default SvgStopMediaIcon
