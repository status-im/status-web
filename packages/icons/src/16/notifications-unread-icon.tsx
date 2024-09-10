import type { SVGProps } from 'react'

const SvgNotificationsUnreadIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M7.439 1.425c-.846.078-1.706.35-2.423.973-.882.767-1.453 1.987-1.586 3.764-.047.628-.068.905-.081 1.003a9.165 9.165 0 0 1-.093.494l-.844 4.223-.144.718H4.96a3.1 3.1 0 0 0 6.082 0h2.691l-.144-.718-.402-2.01A5.52 5.52 0 0 1 12 10h-.012l.28 1.4H3.732l.7-3.506.006-.023c.05-.25.08-.404.1-.544.019-.14.042-.455.084-1.01l.005-.065c.117-1.565.601-2.448 1.177-2.949.284-.247.613-.42.974-.533a5.48 5.48 0 0 1 .661-1.345ZM6.197 12.6a1.9 1.9 0 0 0 3.606 0H6.197Z"
      clipRule="evenodd"
    />
    <circle cx={12} cy={4.5} r={4} fill="#2A4AF5" />
  </svg>
)
export default SvgNotificationsUnreadIcon
