export default function PercentIcon({
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
      <g clipPath="url(#a-percent-icon)">
        <g
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath="url(#b-percent-icon)"
        >
          <path
            strokeWidth="1.5"
            d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12.5 7.5l-5 5"
          />
          <path strokeWidth="2" d="M7.5 7.5h.008M12.5 12.5h.008" />
        </g>
      </g>
      <defs>
        <clipPath id="a-percent-icon">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
        <clipPath id="b-percent-icon">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
