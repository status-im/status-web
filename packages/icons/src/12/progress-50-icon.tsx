import type { SVGProps } from 'react'

const SvgProgress50Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#prefix__clip0_4019_977)">
      <circle
        cx={6}
        cy={6}
        r={5.45}
        stroke="#09101C"
        strokeWidth={1.1}
        opacity={0.2}
      />
      <mask
        id="prefix__mask0_4019_977"
        width={6}
        height={12}
        x={6}
        y={0}
        maskUnits="userSpaceOnUse"
        style={{
          maskType: 'alpha',
        }}
      >
        <path fill="#09101C" d="M6 0h6v12H6V0Z" />
      </mask>
      <g mask="url(#prefix__mask0_4019_977)">
        <circle cx={6} cy={6} r={5.45} stroke="#09101C" strokeWidth={1.1} />
      </g>
    </g>
    <defs>
      <clipPath id="prefix__clip0_4019_977">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgProgress50Icon
