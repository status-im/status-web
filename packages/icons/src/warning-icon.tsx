import { createIcon } from '../lib/create-icon'

const SvgWarningIcon = createIcon(props => {
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
        d="M10.23 1.446 10 1.35l-.23.095-5.656 2.343-.23.095-.095.23L1.446 9.77 1.35 10l.095.23 2.343 5.656.095.23.23.095 5.656 2.343.23.096.23-.096 5.656-2.343.23-.095.095-.23 2.343-5.656.096-.23-.096-.23-2.343-5.656-.095-.23-.23-.095-5.656-2.343ZM2.65 10l2.152-5.198L10 2.65l5.198 2.153L17.35 10l-2.153 5.198L10 17.35l-5.198-2.153L2.65 10Zm7.9 1.5.2-6h-1.5l.2 6h1.1Zm.2 2.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgWarningIcon
