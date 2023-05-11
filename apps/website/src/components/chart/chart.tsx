import { ParentSize } from '@visx/responsive'

import { ChartComponent } from './components'

type DayType = {
  date: string
  open_issues: number
  closed_issues: number
}

interface Props {
  data: DayType[]
  width?: number
  height?: number
}

const Chart = (props: Props) => {
  const { width, ...rest } = props
  return (
    <ParentSize style={{ maxHeight: 326 }}>
      {({ width: w }) => {
        return <ChartComponent {...rest} width={width || w} />
      }}
    </ParentSize>
  )
}

export { Chart }
export type { Props as ChartProps, DayType }
