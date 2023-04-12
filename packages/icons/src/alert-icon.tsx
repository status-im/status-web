import { createIcon } from '../lib/create-icon'

const SvgAlertIcon = createIcon(props => {
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
        d="M3.1 10a6.9 6.9 0 1 1 13.8 0 6.9 6.9 0 0 1-13.8 0ZM10 1.9a8.1 8.1 0 1 0 0 16.2 8.1 8.1 0 0 0 0-16.2Zm.55 9.6.2-6h-1.5l.2 6h1.1Zm.2 2.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgAlertIcon
