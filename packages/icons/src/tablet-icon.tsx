import { createIcon } from '../lib/create-icon'

const SvgTabletIcon = createIcon(props => {
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
        d="M10 2.5c6 0 6.5.5 6.5 7.5s-.5 7.5-6.5 7.5S3.5 17 3.5 10 4 2.5 10 2.5Z"
      />
    </svg>
  )
})

export default SvgTabletIcon
