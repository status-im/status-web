import { createIcon } from '../lib/create-icon'

const SvgSendIcon = createIcon(props => {
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
        d="m10 4.69.404.366 5.5 5-.807.888-5.096-4.633-5.097 4.633-.807-.888 5.5-5 .404-.367Z"
        clipRule="evenodd"
      />
      <mask
        id="send-icon_svg__b"
        width={2}
        height={13}
        x={9}
        y={5}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path
          fill="url(#send-icon_svg__a)"
          d="M11 17.5h2v12h-2z"
          transform="rotate(-180 11 17.5)"
        />
      </mask>
      <g mask="url(#send-icon_svg__b)">
        <path stroke={props.color} strokeWidth={1.2} d="M10 17.5V6" />
      </g>
      <defs>
        <linearGradient
          id="send-icon_svg__a"
          x1={12}
          x2={12}
          y1={18}
          y2={23.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgSendIcon
