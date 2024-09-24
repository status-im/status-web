import type { SVGProps } from 'react'

const SvgVolumeIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path
      stroke="currentColor"
      strokeWidth={1.2}
      d="M8 5c-3 0-3.5.5-3.5 3S5 11 8 11l3.5 2.5v-11L8 5Z"
    />
  </svg>
)
export default SvgVolumeIcon
