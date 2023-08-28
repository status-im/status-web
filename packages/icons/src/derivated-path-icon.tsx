import { createIcon } from '../lib/create-icon'

const SvgDerivatedPathIcon = createIcon(props => {
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
        d="M2.6 7a3.4 3.4 0 1 1 6.8 0 3.4 3.4 0 0 1-6.8 0ZM6 2.4a4.6 4.6 0 1 0 2.9 8.171l3.31 2.575a3.1 3.1 0 1 0 .724-.957L9.728 9.695c.438-.604.733-1.32.834-2.095h1.396a3.101 3.101 0 1 0 0-1.2h-1.396A4.6 4.6 0 0 0 6 2.4Zm9 2.7a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Zm0 7.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgDerivatedPathIcon
