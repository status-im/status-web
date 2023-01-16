// import { Circle } from '../components/circle'
import { Shape, Button, Sidebar, Image, Input } from '@status-im/components'

export default function Home() {
  return (
    <div id="app">
      <div id="sidebar">
        <Sidebar
          name="Rarible"
          description="Multichain community-centric NFT marketplace. Create, buy and sell your NFTs."
          membersCount={123}
        />
      </div>

      <main id="main">
        <div>topbar</div>
        <div>content</div>
        <div>composer</div>
      </main>
    </div>
  )
}
