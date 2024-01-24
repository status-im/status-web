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
        d="M8.031 2.659a7.6 7.6 0 0 1 7.87 2.553V3.5h1.2v4.1H13V6.4h2.289a6.4 6.4 0 1 0 .25 6.8l1.04.6A7.6 7.6 0 1 1 8.03 2.659Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgRefreshIcon
