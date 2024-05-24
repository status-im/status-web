import { createIcon } from '../lib/create-icon'

const SvgSwapBlurIcon = createIcon(props => {
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
        id="swap-blur-icon_svg__b"
        width={9}
        height={16}
        x={9}
        y={3}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path fill="url(#swap-blur-icon_svg__a)" d="M9 3h9v16H9V3Z" />
      </mask>
      <g mask="url(#swap-blur-icon_svg__b)">
        <path
          fill={props.color}
          fillRule="evenodd"
          d="m14.1 14.178 3.005-2.63.79.904-4 3.5-.395.346-.395-.346-4-3.5.79-.903 3.005 2.63V3.5h1.2v10.678Z"
          clipRule="evenodd"
        />
      </g>
      <mask
        id="swap-blur-icon_svg__d"
        width={9}
        height={16}
        x={2}
        y={1}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path fill="url(#swap-blur-icon_svg__c)" d="M11 17H2V1h9v16Z" />
      </mask>
      <g mask="url(#swap-blur-icon_svg__d)">
        <path
          fill={props.color}
          fillRule="evenodd"
          d="m5.9 5.822-3.005 2.63-.79-.903 4-3.5.395-.346.395.345 4 3.5-.79.904L7.1 5.822V16.5H5.9V5.822Z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <linearGradient
          id="swap-blur-icon_svg__a"
          x1={13.5}
          x2={13.5}
          y1={3.645}
          y2={10.742}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
        <linearGradient
          id="swap-blur-icon_svg__c"
          x1={6.5}
          x2={6.5}
          y1={16.355}
          y2={9.258}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={props.color} stopOpacity={0} />
          <stop offset={1} stopColor={props.color} />
        </linearGradient>
      </defs>
    </svg>
  )
})

export default SvgSwapBlurIcon
