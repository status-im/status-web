export default function HomeIcon({
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
        d="M12.5 17.5v-6.667a.833.833 0 0 0-.833-.833H8.333a.833.833 0 0 0-.833.833V17.5"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M2.5 8.334a1.667 1.667 0 0 1 .59-1.273l5.834-5a1.667 1.667 0 0 1 2.152 0l5.833 5a1.668 1.668 0 0 1 .591 1.273v7.5a1.666 1.666 0 0 1-1.667 1.667H4.167A1.667 1.667 0 0 1 2.5 15.834v-7.5Z"
      />
    </svg>
  )
}
