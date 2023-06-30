import { Stack } from '@tamagui/core'
import { ParentSize } from '@visx/responsive'

import { ChartComponent, Loading } from './components'

type DayType = {
  date: string
  open_issues: number
  closed_issues: number
}

interface Props {
  data: DayType[]
  height?: number
  isLoading?: boolean
}

const Chart = (props: Props) => {
  const { data, isLoading, ...rest } = props

  if (isLoading) {
    return (
      <Stack width="100%" height={rest.height}>
        <Loading />
      </Stack>
    )
  }

  return (
    <ParentSize style={{ maxHeight: 326 }}>
      {({ width }) => {
        return <ChartComponent {...rest} data={data} width={width} />
      }}
    </ParentSize>
  )
}

export { Chart }
export type { Props as ChartProps, DayType }
