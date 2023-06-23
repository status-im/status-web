import { createIcon } from '../lib/create-icon'

const SvgFlickrIcon = createIcon(props => {
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
        d="M15.5 14.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-11 0a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z"
      />
    </svg>
  )
})

export default SvgFlickrIcon
