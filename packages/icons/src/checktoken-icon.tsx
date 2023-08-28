import { createIcon } from '../lib/create-icon'

const SvgChecktokenIcon = createIcon(props => {
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
        d="M3 10a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z"
        clipRule="evenodd"
      />
      <path stroke="#fff" strokeWidth={1.2} d="M14 10a4 4 0 1 1-4-4" />
      <mask
        id="checktoken-icon_svg__b"
        width={6}
        height={6}
        x={10}
        y={4}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path fill="url(#checktoken-icon_svg__a)" d="M10 4h6v6h-6V4Z" />
      </mask>
      <g mask="url(#checktoken-icon_svg__b)">
        <path stroke="#fff" strokeWidth={1.2} d="M14 10a4 4 0 0 0-4-4" />
      </g>
      <defs>
        <linearGradient
          id="checktoken-icon_svg__a"
          x1={9.6}
          x2={13.117}
          y1={5.6}
          y2={7.928}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgChecktokenIcon
