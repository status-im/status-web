import { useStorage } from '@plasmohq/storage/hook'

const PinInstructions = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showPinInstructions, setShowPinInstructions] = useStorage(
    'show-pin-instructions',
  )

  return (
    <div className="-mx-5 mt-8 flex items-center gap-2 border-t border-neutral-80/5 px-4 pt-3">
      <div className="flex-1">
        <div className="text-15 font-semibold text-neutral-100">
          Pin the extension
        </div>
        <div className="flex items-center gap-1 text-13 font-regular">
          Click <PuzzleIcon /> and then <PinIcon /> and voilà!
        </div>
      </div>
      <button
        className="group inline-flex h-8 items-center justify-center gap-1 whitespace-nowrap rounded-xl border border-neutral-30 bg-white-100 px-3 text-center text-15 font-medium leading-normal text-neutral-100 outline-none transition-all hover:border-neutral-40 active:border-neutral-50"
        onClick={() => setShowPinInstructions(false)}
      >
        Dismiss
      </button>
    </div>
  )
}

export { PinInstructions }

const PuzzleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
    <path
      fill="#09101C"
      fillRule="evenodd"
      d="M7.5 2.6a.9.9 0 0 0-.9.9v.6H5V2.9h.487a2.1 2.1 0 0 1 4.026 0h.611c.4 0 .735 0 1.01.023.287.023.56.074.82.206a2.1 2.1 0 0 1 .917.918c.132.26.183.532.207.82.022.274.022.61.022 1.01v.61a2.1 2.1 0 0 1 0 4.026v.612c0 .4 0 .735-.022 1.01-.024.287-.075.56-.207.819a2.1 2.1 0 0 1-.918.918c-.259.132-.532.183-.819.206-.275.023-.61.023-1.01.023H4.876c-.4 0-.735 0-1.01-.023-.287-.023-.56-.074-.82-.206a2.1 2.1 0 0 1-.917-.918c-.132-.26-.183-.532-.207-.82-.022-.274-.022-.61-.022-1.01V9.4h.6a.9.9 0 1 0 0-1.8h-.6V5.876c0-.4 0-.735.022-1.01.024-.287.075-.56.207-.819a2.1 2.1 0 0 1 .918-.918c.259-.132.532-.183.819-.206.275-.022.61-.022 1.01-.022H5v1.2h-.1c-.43 0-.716 0-.936.018-.213.017-.31.048-.373.08a.9.9 0 0 0-.393.393c-.031.062-.062.16-.08.372-.018.22-.018.507-.018.937v.586a2.1 2.1 0 0 1 0 4.026v.588c0 .43 0 .716.018.936.018.213.049.31.08.372a.9.9 0 0 0 .393.393c.062.032.16.063.373.08.22.018.506.018.936.018h5.2c.43 0 .716 0 .936-.018.213-.017.31-.048.373-.08a.9.9 0 0 0 .393-.393c.031-.062.062-.16.08-.372.017-.22.018-.507.018-.937V9.4h.6a.9.9 0 1 0 0-1.8h-.6V5.9c0-.43 0-.716-.018-.936-.018-.213-.049-.31-.08-.372a.9.9 0 0 0-.393-.393c-.062-.032-.16-.063-.373-.08-.22-.018-.506-.018-.936-.018H8.4v-.6a.9.9 0 0 0-.9-.9Z"
      clipRule="evenodd"
    />
  </svg>
)

const PinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
    <g clipPath="url(#a)">
      <path
        fill="#09101C"
        fillRule="evenodd"
        d="M6.657 5.955c.497-.86.897-1.491 1.25-1.942.355-.454.625-.677.846-.78.377-.176.821-.097 1.932.545 1.111.641 1.402.986 1.439 1.4.02.243-.037.59-.253 1.124-.214.53-.56 1.193-1.057 2.053l-.073.126-.007.145-.173 3.53L3.58 8.123l2.896-1.973.113-.077.069-.119Zm4.628-3.217c-1.054-.608-2.033-1.062-3.04-.593-.47.22-.88.613-1.284 1.129-.387.495-.8 1.147-1.274 1.962L2.114 7.67l-.789.538.827.478 3.744 2.161-1.886 3.114h1.5l1.438-2.506 3.864 2.23.852.492.048-.981.214-4.367c.467-.815.823-1.497 1.058-2.078.245-.607.38-1.16.335-1.677-.097-1.105-.98-1.727-2.034-2.336Z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)
