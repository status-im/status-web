import { createIcon } from '../lib/create-icon'

const SvgLoadingIcon = createIcon(props => {
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
        stroke={props.color}
        strokeWidth={1.2}
        d="M10.1 2.6a7.5 7.5 0 1 0 7.5 7.5"
      />
      <mask
        id="loading-icon_svg__b"
        width={10}
        height={10}
        x={9}
        y={1}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path fill="url(#loading-icon_svg__a)" d="M9 1h10v10H9z" />
      </mask>
      <g mask="url(#loading-icon_svg__b)">
        <path
          stroke={props.color}
          strokeWidth={1.2}
          d="M17.6 10.1a7.5 7.5 0 0 0-7.5-7.5"
        />
      </g>
      <defs>
        <linearGradient
          id="loading-icon_svg__a"
          x1={11}
          x2={15.396}
          y1={3}
          y2={5.909}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgLoadingIcon
