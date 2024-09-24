import type { SVGProps } from 'react'

const SvgPositiveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <g clipPath="url(#prefix__clip0_149_67)" clipRule="evenodd">
      <path
        stroke="#23ADA0"
        strokeWidth={1.2}
        d="M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Z"
        opacity={0.4}
      />
      <path
        fill="#23ADA0"
        fillRule="evenodd"
        d="M8.384 4.54 8 4.218l-.384.32-3 2.5.768.922L7.4 6.281V11h1.2V6.281l2.016 1.68.768-.922-3-2.5Z"
      />
    </g>
    <defs>
      <clipPath id="prefix__clip0_149_67">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
export default SvgPositiveIcon
