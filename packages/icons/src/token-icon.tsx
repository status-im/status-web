import { createIcon } from '../lib/create-icon'

const SvgTokenIcon = createIcon(props => {
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
        d="M3.6 10a6.4 6.4 0 1 1 12.8 0 6.4 6.4 0 0 1-12.8 0ZM10 2.4a7.6 7.6 0 1 0 0 15.2 7.6 7.6 0 0 0 0-15.2Zm1.409 3.826a3.28 3.28 0 0 0-.81-.269V5H9.4v.957a3.238 3.238 0 0 0-.355.09c-.783.244-1.455.777-1.926 1.493A4.492 4.492 0 0 0 6.4 10c0 .881.248 1.746.718 2.46.47.716 1.143 1.249 1.926 1.493.118.037.236.067.356.09V15h1.2v-.957a3.25 3.25 0 0 0 .809-.27c.742-.358 1.343-.982 1.726-1.757l-1.075-.532c-.277.56-.695.978-1.173 1.21a2.007 2.007 0 0 1-1.485.114c-.493-.154-.947-.5-1.281-1.007a3.293 3.293 0 0 1-.521-1.8c0-.66.187-1.294.52-1.802.335-.507.79-.853 1.282-1.007a2.002 2.002 0 0 1 1.485.115c.478.23.896.649 1.173 1.21l1.075-.533c-.383-.774-.984-1.399-1.726-1.758Z"
        clipRule="evenodd"
      />
    </svg>
  )
})

export default SvgTokenIcon
