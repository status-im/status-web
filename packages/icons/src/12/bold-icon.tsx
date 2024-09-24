import type { SVGProps } from 'react'

const SvgBoldIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    viewBox="0 0 12 12"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M4 .95A1.55 1.55 0 0 0 2.45 2.5v7c0 .856.694 1.55 1.55 1.55h2.5c1.587 0 2.616-.397 3.251-.993a2.48 2.48 0 0 0 .799-1.807c0-.49-.163-1.212-.799-1.808a3.292 3.292 0 0 0-1.214-.7c.118-.102.225-.211.322-.326A3.034 3.034 0 0 0 9.55 3.5c0-.525-.16-1.192-.744-1.72C8.232 1.259 7.326.95 6 .95H4Zm-.45 5.6H6.5c1.413 0 2.134.353 2.499.695.364.341.45.744.45 1.005 0 .26-.086.663-.45 1.005-.365.342-1.086.695-2.5.695H4a.45.45 0 0 1-.45-.45V6.55Zm2.481-1.1c1.096-.007 1.673-.369 1.985-.741.334-.397.434-.885.434-1.209 0-.308-.09-.641-.381-.905-.3-.27-.896-.545-2.069-.545H4a.45.45 0 0 0-.45.45v2.95H6.031Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgBoldIcon
