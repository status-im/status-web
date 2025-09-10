export default function GovernanceIcon({
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
        d="M8.333 15V9.165M9.267 1.832a1.667 1.667 0 0 1 1.466.005l6.555 3.205c.397.195.259.791-.183.791H2.895c-.442 0-.58-.596-.183-.79l6.555-3.211ZM11.667 15V9.165M15 15V9.165M2.5 18.334h15M5 15V9.165"
      />
    </svg>
  )
}
