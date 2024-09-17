import type { SVGProps } from 'react'

const SvgWorldIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 20 20"
    aria-hidden={true}
    focusable={false}
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M4.379 6.938a6.4 6.4 0 0 0 10.868 6.728l-2.122-1.697-.348-.278.166-.414.795-1.987-2.507-1.253-.808-.404.686-.589L13.73 4.8a6.365 6.365 0 0 0-3.13-1.171V5.37l-.33.167-1.804.901-.545 1.27 2.894 1.781.468.288-.246.491-.936 1.874v2.744l-.823-.329-2.5-1-.322-.129-.05-.343-.5-3.5-.023-.167.066-.154.461-1.077-2.03-1.25Zm.672-.996 1.836 1.13.561-1.308.087-.202.196-.099L9.4 4.63V3.628a6.39 6.39 0 0 0-4.35 2.314ZM16.4 10c0 .93-.198 1.812-.554 2.609l-1.624-1.3.835-2.086.205-.513-.494-.247-2.192-1.095 2.067-1.772A6.378 6.378 0 0 1 16.4 10Zm-14 0a7.6 7.6 0 1 1 15.2 0 7.6 7.6 0 0 1-15.2 0Zm4.718-.418.325-.759 2.274 1.4-.754 1.509-.063.126v1.256l-1.355-.542-.427-2.99Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgWorldIcon