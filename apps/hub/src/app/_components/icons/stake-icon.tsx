export default function StakeIcon({
  className = '',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Replace this with the actual SVG path from Figma */}
      <path
        d="M10 2L13.09 6.26L18 7.27L15 10.77L15.18 15.73L10 13.77L4.82 15.73L5 10.77L2 7.27L6.91 6.26L10 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
