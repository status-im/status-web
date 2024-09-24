import type { SVGProps } from 'react'

const SvgColourPreviewIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <circle cx={6} cy={6} r={4} fill="var(--customisation-50, #2A4AF5)" />
  </svg>
)
export default SvgColourPreviewIcon
