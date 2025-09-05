export default function DiscoverIcon({
  className = '',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      className={className}
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.5 2.5H3.333a.833.833 0 0 0-.833.833V7.5c0 .46.373.833.833.833H7.5c.46 0 .833-.373.833-.833V3.333A.833.833 0 0 0 7.5 2.5ZM16.667 2.5H12.5a.833.833 0 0 0-.833.833V7.5c0 .46.373.833.833.833h4.167c.46 0 .833-.373.833-.833V3.333a.833.833 0 0 0-.833-.833ZM16.667 11.666H12.5a.833.833 0 0 0-.833.833v4.167c0 .46.373.833.833.833h4.167c.46 0 .833-.373.833-.833v-4.167a.833.833 0 0 0-.833-.833ZM7.5 11.666H3.333a.833.833 0 0 0-.833.833v4.167c0 .46.373.833.833.833H7.5c.46 0 .833-.373.833-.833v-4.167a.833.833 0 0 0-.833-.833Z"
      />
    </svg>
  )
}
