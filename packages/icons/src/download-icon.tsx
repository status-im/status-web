import { createIcon } from '../lib/create-icon'

const SvgDownloadIcon = createIcon(props => {
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
        fill={props.color}
        fillRule="evenodd"
        d="M15.096 9.056 10.6 13.144V2.5H9.4v10.644L4.904 9.056l-.808.888 5.5 5 .404.367.404-.367 5.5-5-.808-.888ZM3 17.6h14v-1.2H3v1.2Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgDownloadIcon
