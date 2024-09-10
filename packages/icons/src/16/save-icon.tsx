import type { SVGProps } from 'react'

const SvgSaveIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="m8.6 10.752 4.025-3.22.75.937-5 4-.375.3-.375-.3-5-4 .75-.938 4.025 3.22V1.5h1.2v9.252ZM2 15.1v-1.2h12v1.2H2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgSaveIcon
