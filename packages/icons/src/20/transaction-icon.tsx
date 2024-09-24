import type { SVGProps } from 'react'

const SvgTransactionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="m10.895 7.549-4-3.5-.395-.347-.395.346-4 3.5.79.904L6.5 5.297l3.605 3.155.79-.903Zm-1.79 4.902 4 3.5.395.347.395-.346 4-3.5-.79-.903-3.605 3.154-3.605-3.154-.79.902Z"
      clipRule="evenodd"
    />
    <mask
      id="prefix__mask0_347_91"
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
        fill="url(#prefix__paint0_linear_347_91)"
        d="M7.5 17h2v12h-2z"
        transform="rotate(180 7.5 17)"
      />
    </mask>
    <g mask="url(#prefix__mask0_347_91)">
      <path stroke="currentColor" strokeWidth={1.2} d="M6.5 16.5V5" />
    </g>
    <mask
      id="prefix__mask1_347_91"
      width={3}
      height={13}
      x={12}
      y={3}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: 'alpha',
      }}
    >
      <path fill="url(#prefix__paint1_linear_347_91)" d="M12.5 3h2v12h-2z" />
    </mask>
    <g mask="url(#prefix__mask1_347_91)">
      <path stroke="currentColor" strokeWidth={1.2} d="M13.5 3.5V15" />
    </g>
    <defs>
      <linearGradient
        id="prefix__paint0_linear_347_91"
        x1={8.5}
        x2={8.5}
        y1={17.5}
        y2={23}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
      <linearGradient
        id="prefix__paint1_linear_347_91"
        x1={13.5}
        x2={13.5}
        y1={3.5}
        y2={9}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#09101C" stopOpacity={0} />
        <stop offset={1} stopColor="#09101C" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgTransactionIcon
