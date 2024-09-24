import type { SVGProps } from 'react'

const SvgConnectedIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M1.628 2.35c.623-.8 1.654-.9 2.872-.9v1.1c-1.282 0-1.75.15-2.003.475-.138.177-.258.464-.337.96-.079.495-.11 1.147-.11 2.015 0 .868.031 1.52.11 2.015.08.496.199.783.337.96.252.325.721.475 2.003.475v1.1c-1.218 0-2.25-.1-2.872-.9-.3-.385-.461-.88-.554-1.462C.981 7.605.95 6.882.95 6c0-.882.031-1.605.124-2.188.093-.582.254-1.077.554-1.462Zm4.046 3.1H10.5v1.1H5.674l1.749 2.098-.846.704-2.5-3L3.784 6l.293-.352 2.5-3 .846.704L5.674 5.45Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgConnectedIcon
