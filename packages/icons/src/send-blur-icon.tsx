import { createIcon } from '../lib/create-icon'

const SvgSendBlurIcon = createIcon(props => {
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
        id="send-blur-icon_svg__b"
        width={14}
        height={17}
        x={3}
        y={1}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path
          fill="url(#send-blur-icon_svg__a)"
          d="M16.5 18h13v17h-13z"
          transform="rotate(-180 16.5 18)"
        />
      </mask>
      <g mask="url(#send-blur-icon_svg__b)">
        <path
          fill={props.color}
          fillRule="evenodd"
          d="m9.4 6.857-4.496 4.087-.807-.888 5.5-5 .404-.367.403.367 5.5 5-.807.888L10.6 6.856V17.5H9.4V6.857Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <linearGradient
          id="send-blur-icon_svg__a"
          x1={23}
          x2={23}
          y1={18.708}
          y2={26.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgSendBlurIcon
