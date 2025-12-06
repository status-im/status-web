export default function HandIcon({
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
      <path
        d="M14.5 9.25V5.5C14.5 5.10218 14.342 4.72064 14.0607 4.43934C13.7794 4.15804 13.3978 4 13 4C12.6022 4 12.2206 4.15804 11.9393 4.43934C11.658 4.72064 11.5 5.10218 11.5 5.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.5 8.5V4C11.5 3.60218 11.342 3.22064 11.0607 2.93934C10.7794 2.65804 10.3978 2.5 10 2.5C9.60218 2.5 9.22064 2.65804 8.93934 2.93934C8.65804 3.22064 8.5 3.60218 8.5 4V5.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.5 8.875V5.5C8.5 5.10218 8.34196 4.72064 8.06066 4.43934C7.77936 4.15804 7.39782 4 7 4C6.60218 4 6.22064 4.15804 5.93934 4.43934C5.65804 4.72064 5.5 5.10218 5.5 5.5V11.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.5001 7C14.5001 6.60218 14.6581 6.22064 14.9394 5.93934C15.2207 5.65804 15.6023 5.5 16.0001 5.5C16.3979 5.5 16.7794 5.65804 17.0607 5.93934C17.342 6.22064 17.5001 6.60218 17.5001 7V11.5C17.5001 13.0913 16.8679 14.6174 15.7427 15.7426C14.6175 16.8679 13.0914 17.5 11.5001 17.5H10.0001C7.90008 17.5 6.62508 16.855 5.50758 15.745L2.80758 13.045C2.54953 12.7592 2.41127 12.3851 2.42142 12.0002C2.43157 11.6153 2.58936 11.249 2.86212 10.9772C3.13487 10.7054 3.5017 10.5489 3.88666 10.5401C4.27161 10.5314 4.6452 10.6709 4.93008 10.93L6.25008 12.25"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
