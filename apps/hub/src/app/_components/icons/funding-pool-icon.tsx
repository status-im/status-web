export default function FundingPoolIcon({
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
        d="M11.7859 15.1142C11.5358 15.9414 11.0755 16.6896 10.45 17.2858C9.82448 17.8821 9.05511 18.3061 8.21693 18.5164C7.37875 18.7267 6.50036 18.7162 5.66744 18.4859C4.83453 18.2556 4.07553 17.8134 3.46447 17.2023C2.85341 16.5912 2.41115 15.8322 2.18084 14.9993C1.95053 14.1664 1.94003 13.288 2.15035 12.4498C2.36068 11.6117 2.78466 10.8423 3.38093 10.2168C3.9772 9.5913 4.72541 9.13102 5.55258 8.88086"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.832 5.33398H13.6654V8.66732"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.44531 12.6413L6.16698 12.2246L7.83365 15.1113"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.6641 12C16.4255 12 18.6641 9.76142 18.6641 7C18.6641 4.23858 16.4255 2 13.6641 2C10.9026 2 8.66406 4.23858 8.66406 7C8.66406 9.76142 10.9026 12 13.6641 12Z"
      />
    </svg>
  )
}
