import { createIcon } from '../lib/create-icon'

const SvgUnitedArabEmiratesIcon = createIcon(props => {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      fill="none"
      viewBox="0 0 20 20"
      focusable={false}
      aria-hidden={true}
    >
      <path
        fill="#068241"
        d="M17.778 2.778H5v5h15V5a2.222 2.222 0 0 0-2.222-2.222Z"
      />
      <path fill="#fff" d="M5 7.778h15v4.444H5V7.778Z" />
      <path
        fill="#141414"
        d="M5 17.222h12.778A2.222 2.222 0 0 0 20 15v-2.778H5v5Z"
      />
      <path
        fill="#EC2028"
        d="M2.222 2.778A2.222 2.222 0 0 0 0 5v10c0 1.227.995 2.222 2.222 2.222H5V2.778H2.222Z"
      />
    </svg>
  )
})

export default SvgUnitedArabEmiratesIcon
