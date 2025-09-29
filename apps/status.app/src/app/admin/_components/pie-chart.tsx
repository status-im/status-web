'use client'

import { forwardRef, useState } from 'react'

import * as Popover from '@radix-ui/react-popover'
import { animated, to, useTransition } from '@react-spring/web'
import { ChevronRightIcon } from '@status-im/icons/20'
import { Group } from '@visx/group'
import Pie from '@visx/shape/lib/shapes/Pie'

import { Link } from '~components/link'

import type { PieArcDatum, ProvidedProps } from '@visx/shape/lib/shapes/Pie'

interface ItemUsage {
  id: string
  label: string
  amount: number
  color: string
  // Children and color are not inside children and have to be omited
  children?: Omit<ItemUsage, 'children' | 'color'>[]
}

// accessor functions
const usage = (d: ItemUsage) => d.amount

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 }

type PieProps = {
  size?: number
  margin?: typeof defaultMargin
  animate?: boolean
  delay?: number
  hoveredCaption: string
  data: ItemUsage[]
  title: string
  url?: string
}

const PieChart = (props: PieProps) => {
  const {
    size = 166,
    margin = defaultMargin,
    animate = true,
    delay,
    data,
    hoveredCaption,
    title,
    url,
  } = props

  const [hovered, setHovered] = useState<string | null>(null)
  const half = size / 2

  const innerWidth = size - margin.left - margin.right
  const innerHeight = size - margin.top - margin.bottom
  const centerY = innerHeight / 2
  const centerX = innerWidth / 2

  const hoveredItem = data.find(item => item.id === hovered)

  const total = data.reduce((acc, item) => acc + item.amount, 0)

  return (
    <div className="flex w-full flex-col">
      <div className="px-4 py-3">
        {url ? (
          <Link
            href={url}
            className="flex items-end text-15 font-semibold transition-colors duration-200 hover:text-neutral-50 [&>svg]:hover:text-neutral-50"
          >
            {title}
            {/* TODO remove this hacky solution whe we have the Link component from our design system */}
            <ChevronRightIcon />
          </Link>
        ) : (
          <span className="text-15 font-semibold">{title}</span>
        )}
      </div>
      <div className="flex w-full flex-col items-start justify-evenly 2xl:flex-row 2xl:items-center">
        <div className="flex w-full items-center justify-center 2xl:w-auto">
          <svg width={size} height={size}>
            <Group top={centerY + margin.top} left={centerX + margin.left}>
              <Pie
                data={data}
                pieValue={usage}
                outerRadius={half}
                innerRadius={half - half * 0.2}
                padAngle={0.02}
              >
                {pie => {
                  return (
                    <>
                      <AnimatedPie<ItemUsage>
                        {...pie}
                        animate={animate}
                        getKey={arc => arc.data.id}
                        getColor={arc => arc.data.color}
                        hovered={hovered}
                        setHovered={setHovered}
                        delay={delay}
                      />
                    </>
                  )
                }}
              </Pie>
              {hoveredItem && (
                <>
                  <text
                    dy="-0.3em"
                    textAnchor="middle"
                    fontSize="19"
                    fontWeight="600"
                    fill="black"
                  >
                    {hoveredItem.amount}
                  </text>
                  <text
                    dy="1em"
                    textAnchor="middle"
                    fontSize="15"
                    fontWeight="500"
                    fill="black"
                  >
                    {hoveredCaption}
                  </text>
                </>
              )}
            </Group>
          </svg>
        </div>
        <div className="flex flex-col p-4 pt-6 text-13 2xl:px-4 2xl:pb-8">
          <span className="pb-2 font-medium text-neutral-50">Distribution</span>
          <div className="flex flex-wrap 2xl:flex-col 2xl:gap-0">
            {data.map(item => {
              const hasChildren = item.children && item.children.length > 0

              if (hasChildren) {
                return (
                  <Popover.Root open={item.id === hovered} key={item.id}>
                    <Popover.Trigger asChild>
                      <Legend
                        key={item.id}
                        hovered={hovered}
                        total={total}
                        onMouseEnter={() => setHovered(item.id)}
                        onMouseLeave={() => setHovered(null)}
                        item={item}
                      />
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content
                        side="right"
                        sideOffset={-20}
                        align="start"
                        alignOffset={-8}
                        className="z-50 m-auto mb-0 w-full min-w-[296px] max-w-[480px] rounded-12 border border-neutral-10 bg-white-100 p-3 shadow-3 outline-none data-[state=closed]:animate-explanationOut data-[state=open]:animate-explanationIn"
                      >
                        <p className="text-13 font-medium text-neutral-50">
                          {item.label}
                        </p>
                        <div className="flex flex-col gap-2 pb-1 pt-3">
                          {item.children?.map(child => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <span className="font-medium text-neutral-100">
                                  {child.label}
                                </span>
                                <span className="ml-[2px] font-medium text-neutral-50">
                                  ({((child.amount / total) * 100).toFixed(0)}%)
                                </span>
                              </div>
                              <div>
                                <span className="text-15 font-medium">
                                  {child.amount} {hoveredCaption}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                )
              }

              return (
                <Legend
                  key={item.id}
                  hovered={hovered}
                  total={total}
                  onMouseEnter={() => setHovered(item.id)}
                  onMouseLeave={() => setHovered(null)}
                  item={item}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// react-spring transition definitions
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number }

const fromLeaveTransition = <T extends { endAngle: number }>({
  endAngle,
}: T) => ({
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 1,
})

const enterUpdateTransition = <
  T extends { startAngle: number; endAngle: number },
>({
  startAngle,
  endAngle,
}: T) => ({
  startAngle,
  endAngle,
  opacity: 1,
})

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean
  getKey: (d: PieArcDatum<Datum>) => string
  getColor: (d: PieArcDatum<Datum>) => string
  hovered: string | null
  setHovered: (key: string | null) => void
  delay?: number
}

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  hovered,
  setHovered,
  delay,
}: AnimatedPieProps<Datum>) {
  const transitions = useTransition<PieArcDatum<Datum>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
    delay: delay || 0,
  })

  return transitions((props, arc, { key }) => {
    return (
      <g key={key}>
        <animated.path
          // compute interpolated path d attribute from intermediate angle values
          d={to([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            })
          )}
          fill={getColor(arc)}
          opacity={
            hovered ? (hovered === getKey(arc) ? 1 : 0.3) : props.opacity
          }
          style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
          onMouseEnter={() => setHovered(getKey(arc))}
          onMouseLeave={() => setHovered(null)}
        />
      </g>
    )
  })
}

type LegendProps = {
  item: ItemUsage
  hovered: string | null
  onMouseEnter: () => void
  onMouseLeave: () => void
  total: number
}

const Legend = forwardRef<HTMLDivElement, LegendProps>(
  ({ item, hovered, onMouseEnter, onMouseLeave, total }, ref) => {
    return (
      <div
        ref={ref}
        className="flex cursor-pointer items-center py-1 pr-2 transition-opacity duration-200 last-of-type:pb-0 2xl:pr-0"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          opacity: hovered ? (hovered === item.id ? 1 : 0.3) : 1,
        }}
      >
        <div
          className="mr-2 size-3 rounded-full border-2"
          style={{ borderColor: item.color }}
        />
        <span className="font-medium text-neutral-100">{item.label}</span>
        <span className="ml-[2px] font-medium text-neutral-50">
          ({((item.amount / total) * 100).toFixed(0)}%)
        </span>
      </div>
    )
  }
)

Legend.displayName = 'Legend'

export { PieChart }
