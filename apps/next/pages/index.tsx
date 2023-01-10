import { Circle } from '../components/circle'
import { Shape } from '@status-im/components'

export default function Home() {
  return (
    <div>
      <div>
        <h1>Next.js</h1>
        <Circle />
      </div>
      <div>
        <h1>UI</h1>
        <Shape />
      </div>
    </div>
  )
}
