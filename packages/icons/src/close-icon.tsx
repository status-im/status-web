import { createIcon } from '../lib/create-icon'

const SvgCloseIcon = createIcon(props => {
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
        d="m9.153 10-4.576 4.575.848.849 4.576-4.576 4.576 4.576.848-.848L10.85 10l4.575-4.576-.848-.849L10 9.151 5.425 4.576l-.848.848L9.153 10Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgCloseIcon
