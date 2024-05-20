import { createIcon } from '../lib/create-icon'

const SvgConnectIcon = createIcon(props => {
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
        d="M15.374 4.626a3.6 3.6 0 0 0-5.091 0L8.867 6.04l.849.849 1.414-1.414a2.4 2.4 0 1 1 3.394 3.394l-1.414 1.414.848.848 1.415-1.414a3.6 3.6 0 0 0 0-5.091Zm-9.9 6.505 1.414-1.414-.848-.848-1.414 1.414a3.6 3.6 0 0 0 5.09 5.091l1.415-1.414-.848-.849-1.415 1.414a2.4 2.4 0 1 1-3.394-3.394Zm2.829 1.415 4.242-4.243-.848-.849-4.243 4.243.849.849Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgConnectIcon
