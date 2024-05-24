import { createIcon } from '../lib/create-icon'

const SvgBridgeBlurIcon = createIcon(props => {
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
      <g clipPath="url(#bridge-blur-icon_svg__a)">
        <mask
          id="bridge-blur-icon_svg__c"
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
            fill="url(#bridge-blur-icon_svg__b)"
            stroke={props.color}
            d="M-.5-.5h19v19h-19z"
            transform="matrix(0 -1 -1 0 19 19)"
          />
        </mask>
        <g mask="url(#bridge-blur-icon_svg__c)">
          <path
            fill={props.color}
            fillRule="evenodd"
            d="M4.99 10.098 4.5 10l-.49-.099v-.002l.001-.004.003-.014a3.446 3.446 0 0 1 .054-.224 8.6 8.6 0 0 1 1.075-2.43C6.015 5.887 7.528 4.5 10 4.5c2.473 0 3.986 1.387 4.857 2.728a8.602 8.602 0 0 1 1.129 2.653l.003.014v.004l.001.002-.49.099-.49.098-.002-.008-.008-.034a7.103 7.103 0 0 0-.199-.672 7.598 7.598 0 0 0-.783-1.612C13.265 6.612 12.028 5.5 10 5.5c-2.027 0-3.264 1.113-4.018 2.273a7.6 7.6 0 0 0-.99 2.318l-.002.007Z"
            clipRule="evenodd"
          />
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
          id="bridge-blur-icon_svg__b"
          x1={13}
          x2={15.5}
          y1={4.5}
          y2={8}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
        <clipPath id="bridge-blur-icon_svg__a">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
})

export default SvgBridgeBlurIcon
