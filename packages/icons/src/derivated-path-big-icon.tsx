import { createIcon } from '../lib/create-icon'

const SvgDerivatedPathBigIcon = createIcon(props => {
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
      <g clipPath="url(#derivated-path-big-icon_svg__a)">
        <path
          fill={props.color}
          fillRule="evenodd"
          d="M2.2 5.5a3.3 3.3 0 1 1 6.6 0 3.3 3.3 0 0 1-6.6 0ZM5.5.8a4.7 4.7 0 1 0 2.792 8.482l4.144 4.144a3.7 3.7 0 1 0 .99-.99L9.282 8.292a4.676 4.676 0 0 0 .866-2.092h1.718a3.701 3.701 0 1 0 0-1.4h-1.718A4.701 4.701 0 0 0 5.5.8Zm10 2.4a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6Zm0 10a2.3 2.3 0 1 0 0 4.6 2.3 2.3 0 0 0 0-4.6Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="derivated-path-big-icon_svg__a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
})

export default SvgDerivatedPathBigIcon
