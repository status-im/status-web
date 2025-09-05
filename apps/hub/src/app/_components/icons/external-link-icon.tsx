export default function ExternalLinkIcon({
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
        d="M10 2H18V10M18 2L2 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
