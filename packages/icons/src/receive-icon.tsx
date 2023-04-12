import { createIcon } from '../lib/create-icon'

const SvgReceiveIcon = createIcon(props => {
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
        d="m9.597 15.948-5.5-5 .807-.888 5.097 4.633 5.096-4.633.807.888-5.5 5-.403.367-.404-.367Z"
        clipRule="evenodd"
      />
      <mask
        id="receive-icon_svg__b"
        width={2}
        height={13}
        x={9}
        y={3}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path
          fill="url(#receive-icon_svg__a)"
          d="M0 0h2v12H0z"
          transform="matrix(-1 0 0 1 11 3.5)"
        />
      </mask>
      <g mask="url(#receive-icon_svg__b)">
        <path stroke={props.color} strokeWidth={1.2} d="M10 3.5V15" />
      </g>
      <defs>
        <linearGradient
          id="receive-icon_svg__a"
          x1={1}
          x2={1}
          y1={0.5}
          y2={6}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgReceiveIcon
