import { createIcon } from '../lib/create-icon'

const SvgReceiveBlurIcon = createIcon(props => {
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
      <mask
        id="receive-blur-icon_svg__b"
        width={14}
        height={17}
        x={3}
        y={2}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path
          fill="url(#receive-blur-icon_svg__a)"
          d="M0 0h13v17H0z"
          transform="matrix(-1 0 0 1 16.5 2)"
        />
      </mask>
      <g mask="url(#receive-blur-icon_svg__b)">
        <path
          fill={props.color}
          fillRule="evenodd"
          d="M9.4 13.147 4.904 9.06l-.807.888 5.5 5 .404.367.403-.367 5.5-5-.807-.888-4.497 4.088V2.5H9.4v10.647Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <linearGradient
          id="receive-blur-icon_svg__a"
          x1={6.5}
          x2={6.5}
          y1={0.708}
          y2={8.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgReceiveBlurIcon
