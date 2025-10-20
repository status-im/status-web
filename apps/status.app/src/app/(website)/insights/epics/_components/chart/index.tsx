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
      <div className="w-full" style={{ height: rest.height }}>
        <Loading />
      </div>
    )
  }

  return (
    <ParentSize className="max-h-[326px]">
      {({ width }) => {
        return <ChartComponent {...rest} data={data} width={width} />
      }}
    </ParentSize>
  )
}

export { Chart }
export type { DayType }
