import { createIcon } from '../lib/create-icon'

const SvgBulletIcon = createIcon(props => {
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
        d="M6.5 10c0-2.5 1-3.5 3.5-3.5s3.5 1 3.5 3.5-1 3.5-3.5 3.5-3.5-1-3.5-3.5Z"
      />
    </svg>
  )
})

export default SvgBulletIcon
