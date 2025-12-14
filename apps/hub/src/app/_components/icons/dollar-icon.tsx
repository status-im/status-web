export default function DollarIcon({
  className = '',
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
      {...props}
    >
      <g clipPath="url(#clip0_6022_23816)">
        <path
          d="M9.99984 18.3327C14.6022 18.3327 18.3332 14.6017 18.3332 9.99935C18.3332 5.39698 14.6022 1.66602 9.99984 1.66602C5.39746 1.66602 1.6665 5.39698 1.6665 9.99935C1.6665 14.6017 5.39746 18.3327 9.99984 18.3327Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.3332 6.66602H8.33317C7.89114 6.66602 7.46722 6.84161 7.15466 7.15417C6.8421 7.46673 6.6665 7.89065 6.6665 8.33268C6.6665 8.77471 6.8421 9.19863 7.15466 9.51119C7.46722 9.82375 7.89114 9.99935 8.33317 9.99935H11.6665C12.1085 9.99935 12.5325 10.1749 12.845 10.4875C13.1576 10.8001 13.3332 11.224 13.3332 11.666C13.3332 12.108 13.1576 12.532 12.845 12.8445C12.5325 13.1571 12.1085 13.3327 11.6665 13.3327H6.6665"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 15V5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_6022_23816">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}
