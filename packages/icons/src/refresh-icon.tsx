import { createIcon } from '../lib/create-icon'

const SvgRefreshIcon = createIcon(props => {
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
        d="M12.64 3.625a6.9 6.9 0 1 0 3.336 9.825l1.039.6a8.1 8.1 0 1 1-1.115-9.6V3h1.2v4.1H13V5.9h2.55a6.9 6.9 0 0 0-2.91-2.275Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgRefreshIcon
