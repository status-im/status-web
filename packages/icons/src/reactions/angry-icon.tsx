import type { SVGProps } from 'react'

const SvgAngryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <circle cx={6} cy={6} r={6} fill="url(#prefix__paint0_linear_2438_897)" />
    <circle cx={6} cy={6} r={6} fill="url(#prefix__paint1_radial_2438_897)" />
    <path
      fill="#424242"
      d="M2.754 4.198a.328.328 0 1 0-.258.604l.792.339c.105.045.144.175.113.286a.751.751 0 0 0 1.416.488c.022-.053.082-.083.135-.06l.169.072a.328.328 0 0 0 .258-.604L2.754 4.198ZM9.248 4.198a.328.328 0 1 1 .258.604l-.792.339c-.106.045-.144.175-.114.286a.75.75 0 0 1-1.415.488c-.022-.053-.083-.083-.136-.06l-.168.072a.328.328 0 0 1-.258-.604l2.625-1.125Z"
    />
    <path
      fill="#772622"
      fillRule="evenodd"
      d="M6 8.203a1.92 1.92 0 0 0-1.602.86.328.328 0 1 1-.546-.364 2.576 2.576 0 0 1 4.296 0 .328.328 0 1 1-.546.364A1.92 1.92 0 0 0 6 8.203Z"
      clipRule="evenodd"
    />
    <defs>
      <radialGradient
        id="prefix__paint1_radial_2438_897"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="rotate(124.563 3.39 3.337) scale(10.2458 13.3012)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFD764" stopOpacity={0.2} />
        <stop offset={1} stopColor="#FFB746" stopOpacity={0.1} />
      </radialGradient>
      <linearGradient
        id="prefix__paint0_linear_2438_897"
        x1={6}
        x2={6}
        y1={0}
        y2={12}
        gradientUnits="userSpaceOnUse"
      >
        <stop offset={0.11} stopColor="#EA6433" />
        <stop offset={0.547} stopColor="#F2B660" />
        <stop offset={1} stopColor="#FFBA49" />
      </linearGradient>
    </defs>
  </svg>
)
export default SvgAngryIcon
