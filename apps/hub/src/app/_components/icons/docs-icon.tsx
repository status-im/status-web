export default function DocsIcon({
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
        d="M3.333 16.25V3.75a2.083 2.083 0 0 1 2.084-2.084h10.416a.833.833 0 0 1 .834.833v15a.833.833 0 0 1-.834.834H5.417a2.083 2.083 0 0 1-2.084-2.084Zm0 0a2.083 2.083 0 0 1 2.084-2.084h11.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M6.667 9.166h6.666M6.667 5.834h5"
      />
    </svg>
  )
}
