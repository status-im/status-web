import { createIcon } from '../lib/create-icon'

const SvgInfoBadgeIcon = createIcon(props => {
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
        d="M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm-.55-8.5-.2 6h1.5l-.2-6h-1.1Zm-.2-2.25a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgInfoBadgeIcon
