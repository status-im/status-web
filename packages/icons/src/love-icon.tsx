import { createIcon } from '../lib/create-icon'

const SvgLoveIcon = createIcon(props => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      fill="none"
      viewBox="0 0 12 12"
      focusable={false}
      aria-hidden={true}
    >
      <path
        fill="#E45852"
        d="M.375 4.125C.375 7.5 4.343 11.25 6 11.25s5.625-3.75 5.625-7.125c0-1.657-1.125-3-2.625-3-1.318 0-2.438.594-2.84 1.875-.08.188-.12.188-.16.188-.04 0-.08 0-.16-.188C5.439 1.719 4.319 1.125 3 1.125c-1.5 0-2.625 1.343-2.625 3Z"
      />
      <path
        fill="url(#love-icon_svg__a)"
        d="M.375 4.125C.375 7.5 4.343 11.25 6 11.25s5.625-3.75 5.625-7.125c0-1.657-1.125-3-2.625-3-1.318 0-2.438.594-2.84 1.875-.08.188-.12.188-.16.188-.04 0-.08 0-.16-.188C5.439 1.719 4.319 1.125 3 1.125c-1.5 0-2.625 1.343-2.625 3Z"
      />
      <defs>
        <radialGradient
          id="love-icon_svg__a"
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(-.52735 7.74098 -7.4041 -.5044 6 3.957)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F05D56" />
          <stop offset={1} stopColor="#D15954" />
        </radialGradient>
      </defs>
    </svg>
  )
})

export default SvgLoveIcon
