import { createIcon } from '../lib/create-icon'

const SvgSwapIcon = createIcon(props => {
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
        d="m13.452 10.895 3.5-4 .346-.395-.346-.395-3.5-4-.903.79L15.703 6.5l-3.154 3.605.903.79Zm-6.903-1.79-3.5 4-.346.395.345.395 3.5 4 .904-.79L4.297 13.5l3.155-3.605-.903-.79Z"
        clipRule="evenodd"
      />
      <mask
        id="swap-icon_svg__b"
        width={12}
        height={3}
        x={4}
        y={5}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path
          fill="url(#swap-icon_svg__a)"
          d="M4 7.5h2v12H4z"
          transform="rotate(-90 4 7.5)"
        />
      </mask>
      <g mask="url(#swap-icon_svg__b)">
        <path stroke={props.color} strokeWidth={1.2} d="M4.5 6.5H16" />
      </g>
      <mask
        id="swap-icon_svg__d"
        width={12}
        height={3}
        x={4}
        y={12}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path
          fill="url(#swap-icon_svg__c)"
          d="M16 12.5h2v12h-2z"
          transform="rotate(90 16 12.5)"
        />
      </mask>
      <g mask="url(#swap-icon_svg__d)">
        <path stroke={props.color} strokeWidth={1.2} d="M15.5 13.5H4" />
      </g>
      <defs>
        <linearGradient
          id="swap-icon_svg__a"
          x1={5}
          x2={5}
          y1={8}
          y2={13.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
        <linearGradient
          id="swap-icon_svg__c"
          x1={17}
          x2={17}
          y1={13}
          y2={18.5}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgSwapIcon
