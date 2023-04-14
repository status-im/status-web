import { createIcon } from '../lib/create-icon'

const SvgHistoryIcon = createIcon(props => {
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
        d="M11.786 3.335A6.9 6.9 0 0 0 4.45 5.9H7v1.2H2.9V3h1.2v1.45a8.1 8.1 0 1 1-1.115 9.6l1.04-.6a6.9 6.9 0 1 0 7.76-10.115ZM10.7 6.5v3.276l2.629 1.722-.658 1.004-2.9-1.9-.271-.178V6.5h1.2Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgHistoryIcon
