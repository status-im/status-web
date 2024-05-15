import { createIcon } from '../lib/create-icon'

const SvgBridgeIcon = createIcon(props => {
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
      <g clipPath="url(#bridge-icon_svg__a)">
        <mask
          id="bridge-icon_svg__c"
          width={20}
          height={20}
          x={0}
          y={0}
          maskUnits="userSpaceOnUse"
          style={{
            maskType: 'alpha',
          }}
        >
          <path
            fill="url(#bridge-icon_svg__b)"
            d="M0 0h20v20H0z"
            transform="matrix(0 -1 -1 0 20 20)"
          />
        </mask>
        <g mask="url(#bridge-icon_svg__c)">
          <path stroke={props.color} d="M4.5 10s1-5 5.5-5 5.5 5 5.5 5" />
        </g>
        <circle
          cx={4.5}
          cy={12.5}
          r={2.5}
          stroke={props.color}
          strokeWidth={1.2}
        />
        <circle
          cx={15.5}
          cy={12.5}
          r={2.5}
          stroke={props.color}
          strokeWidth={1.2}
        />
      </g>
      <defs>
        <linearGradient
          id="bridge-icon_svg__b"
          x1={13}
          x2={15.5}
          y1={4.5}
          y2={8}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
        <clipPath id="bridge-icon_svg__a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
})

export default SvgBridgeIcon
