import { Stack } from '@tamagui/core'
import { ParentSize } from '@visx/responsive'

import { ChartComponent, Empty, Loading } from './components'

type DayType = {
  date: string
  open_issues: number
  closed_issues: number
}

interface Props {
  data: DayType[]
  width?: number
  height?: number
  isLoading?: boolean
}

const Chart = (props: Props) => {
  const { width, data, isLoading, ...rest } = props

  if (isLoading) {
    return (
      <Stack width={width} height={rest.height}>
        <Loading />
      </Stack>
    )
  }

  if (!data.length) {
    return (
      <Stack width={width} height={rest.height}>
        <Empty />
      </Stack>
    )
  }

  return (
    <ParentSize style={{ maxHeight: 326 }}>
      {({ width: w }) => {
        return <ChartComponent {...rest} data={data} width={width || w} />
      }}
    </ParentSize>
  )
}

export { Chart }
export type { Props as ChartProps, DayType }
