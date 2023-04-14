import { createIcon } from '../lib/create-icon'

const SvgVerifiedIcon = createIcon(props => {
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
        fill="#23ADA0"
        fillRule="evenodd"
        d="M18 10a2.5 2.5 0 0 0-2.058-2.461 2.5 2.5 0 0 0-3.48-3.48 2.5 2.5 0 0 0-4.923 0 2.5 2.5 0 0 0-3.48 3.48 2.5 2.5 0 0 0 0 4.922 2.5 2.5 0 0 0 3.48 3.48 2.5 2.5 0 0 0 4.922 0 2.5 2.5 0 0 0 3.48-3.48A2.5 2.5 0 0 0 18 10Z"
        clipRule="evenodd"
      />
      <path stroke="#fff" strokeWidth={1.2} d="m7.25 10.75 2 1.5 3.5-4.5" />
    </svg>
  )
})

export default SvgVerifiedIcon
