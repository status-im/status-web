import unableToConnectImage from 'url:../../assets/unable-to-connect.png'

import { DownloadButton } from './download-button'

const NotConnected = () => {
  return (
    <div className="flex flex-col items-center">
      <img src={unableToConnectImage} alt="Not connected" className="w-full" />
      <div className="max-w-[304px] pb-5 pt-4 text-center">
        <p className="text-19 font-semibold">Unable to connect to Status</p>
        <p className="text-15">
          Make sure Status desktop app is running on your machine or download it
          below.
        </p>
      </div>
      <DownloadButton />
    </div>
  )
}

export { NotConnected }
