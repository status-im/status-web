import { createIcon } from '../lib/create-icon'

const SvgUnblockIcon = createIcon(props => {
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
        d="M3.1 10a6.9 6.9 0 1 1 13.8 0 6.9 6.9 0 0 1-13.8 0ZM10 1.9a8.1 8.1 0 1 0 0 16.2 8.1 8.1 0 0 0 0-16.2Zm-3 8.7h6V9.4H7v1.2Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgUnblockIcon
