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
        d="m10.895 7.549-4-3.5-.395-.347-.395.346-4 3.5.79.904L6.5 5.297l3.605 3.155.79-.903Zm-1.79 4.902 4 3.5.395.347.395-.346 4-3.5-.79-.903-3.605 3.154-3.605-3.154-.79.902Z"
        clipRule="evenodd"
      />
      <mask
        id="swap-icon_svg__b"
        width={3}
        height={13}
        x={5}
        y={5}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path
          fill="url(#swap-icon_svg__a)"
          d="M7.5 17h2v12h-2z"
          transform="rotate(180 7.5 17)"
        />
      </mask>
      <g mask="url(#swap-icon_svg__b)">
        <path stroke={props.color} strokeWidth={1.2} d="M6.5 16.5V5" />
      </g>
      <mask
        id="swap-icon_svg__d"
        width={3}
        height={13}
        x={12}
        y={3}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path fill="url(#swap-icon_svg__c)" d="M12.5 3h2v12h-2z" />
      </mask>
      <g mask="url(#swap-icon_svg__d)">
        <path stroke={props.color} strokeWidth={1.2} d="M13.5 3.5V15" />
      </g>
      <defs>
        <linearGradient
          id="swap-icon_svg__a"
          x1={8.5}
          x2={8.5}
          y1={17.5}
          y2={23}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
        <linearGradient
          id="swap-icon_svg__c"
          x1={13.5}
          x2={13.5}
          y1={3.5}
          y2={9}
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
