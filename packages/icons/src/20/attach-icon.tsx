import type { SVGProps } from 'react'

const SvgAttachIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M14.49 3.742a3.1 3.1 0 0 0-4.384 0L6.924 6.924 4.626 9.222a4.35 4.35 0 1 0 6.152 6.152l3.712-3.712-.848-.849-3.712 3.712a3.15 3.15 0 0 1-4.455-4.454l2.298-2.298 3.182-3.182a1.9 1.9 0 1 1 2.687 2.687L10.46 10.46l-1.945 1.944a.65.65 0 1 1-.919-.92l4.773-4.772-.848-.849-4.773 4.773a1.85 1.85 0 0 0 2.616 2.617l1.944-1.945 3.182-3.182a3.1 3.1 0 0 0 0-4.384Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgAttachIcon
