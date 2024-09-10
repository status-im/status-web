import type { SVGProps } from 'react'

const SvgObjectsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M7 1.9h-.382l-.162.346-3.5 7.5-.398.854H9.4v6.3H7v1.2h6v-1.2h-2.4v-6.3H17.442l-.398-.854-3.5-7.5-.162-.346H7ZM4.442 9.4l.607-1.3h9.902l.607 1.3H4.442Zm9.95-2.5H5.608l1.773-3.8h5.236l1.773 3.8Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgObjectsIcon
