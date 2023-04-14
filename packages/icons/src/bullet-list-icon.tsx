import { createIcon } from '../lib/create-icon'

const SvgBulletListIcon = createIcon(props => {
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
        d="M8.5 4.4h9v1.2h-9V4.4Zm0 5h9v1.2h-9V9.4Zm9 5h-9v1.2h9v-1.2Z"
        clipRule="evenodd"
        opacity={0.4}
      />
      <path
        fill={props.color}
        fillRule="evenodd"
        d="M6 5a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 6 5Zm0 5a1.25 1.25 0 1 1-2.5 0A1.25 1.25 0 0 1 6 10Zm-1.25 6.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgBulletListIcon
