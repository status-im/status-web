import type { SVGProps } from 'react'

const SvgDownloadIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M15.096 9.056 10.6 13.144V2.5H9.4v10.644L4.904 9.056l-.808.888 5.5 5 .404.367.404-.367 5.5-5-.808-.888ZM3 17.6h14v-1.2H3v1.2Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgDownloadIcon
