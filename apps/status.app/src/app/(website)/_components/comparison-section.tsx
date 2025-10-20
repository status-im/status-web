import { Counter, Tabs, Tag, Text } from '@status-im/components'
import { cx } from 'class-variance-authority'

import { InnerDivider } from './inner-divider'

type Props = {
  label: string
  description: string
  firstTabTitle: string
  secondTabTitle: string
  firstTabItems: ListProps['items']
  secondTabItems: ListProps['items']
  firstTabLastItem?: Item
  secondTabLastItem?: Item
  complementary?: React.ReactNode
  bottomSection?: React.ReactNode
}

const ComparisonSection = (props: Props) => {
  const {
    label,
    description,
    firstTabTitle,
    secondTabTitle,
    firstTabItems,
    secondTabItems,
    firstTabLastItem,
    secondTabLastItem,
    complementary,
    bottomSection,
  } = props

  return (
    <div className="border-dashed-default relative border-t bg-white-100">
      <div className="container-lg">
        <div className="relative grid grid-cols-7 bg-white-100 mix-blend-normal xl:gap-8 2xl:grid-cols-4">
          <div
            className={cx([
              'col-span-full pt-24 xl:col-span-3 xl:pt-40 2xl:col-span-2',
              !!bottomSection && 'pb-[228px] xl:pb-20',
            ])}
          >
            <div className="flex h-full flex-col justify-between">
              <div className="mb-10 inline-flex max-w-[646px] flex-col gap-4 xl:mb-0">
                <div className="inline-flex">
                  <Tag size="24" label={label} />
                </div>
                <h2 className="text-27 font-regular tracking-tighter xl:text-40">
                  {description}
                </h2>
              </div>

              <div className="border-dashed-default mb-5 rounded-20 border border-neutral-80/20 p-5 xl:hidden">
                <Tabs.Root defaultValue="option-one" variant="grey" size="32">
                  <div className="mb-5">
                    <Tabs.List>
                      <Tabs.Trigger value="option-one">
                        {firstTabTitle}
                      </Tabs.Trigger>
                      <Tabs.Trigger value="option-two">
                        {secondTabTitle}
                      </Tabs.Trigger>
                    </Tabs.List>
                  </div>
                  <Tabs.Content value="option-one">
                    <TabList
                      title={firstTabTitle}
                      items={firstTabItems}
                      lastItem={firstTabLastItem}
                    />
                  </Tabs.Content>
                  <Tabs.Content value="option-two">
                    <TabList
                      title={secondTabTitle}
                      items={secondTabItems}
                      lastItem={secondTabLastItem}
                    />
                  </Tabs.Content>
                </Tabs.Root>
              </div>
              {complementary}
            </div>
          </div>

          <div className="col-span-4 hidden grid-cols-2 xl:grid 2xl:col-span-2">
            <List
              title={firstTabTitle}
              items={firstTabItems}
              lastItem={firstTabLastItem}
            />
            <List
              title={secondTabTitle}
              items={secondTabItems}
              lastItem={secondTabLastItem}
            />
          </div>
        </div>
      </div>
      {bottomSection}
    </div>
  )
}

export { ComparisonSection }

type Item = { label: string; description: string; emoji: string }

type ListProps = {
  title: string
  items: string[]
  lastItem?: Item
}

const List = (props: ListProps) => {
  const { title, items, lastItem } = props

  return (
    <div className="relative border-l border-dashed border-neutral-80/20 pb-20 pt-40 xl:px-5 2xl:px-10">
      <div
        role="presentation"
        className="absolute inset-y-0 -left-px hidden h-full w-px bg-gradient-to-t from-white-100 xl:block"
      />
      <Text size={19} weight="semibold">
        {title}
      </Text>
      <div className="flex flex-col pt-3">
        <div className="flex w-full flex-col">
          {items.map((item, index) => {
            const showDivider =
              items.length > 1 && (index !== items.length - 1 || lastItem)

            return (
              <div key={item} className="flex-col">
                <div className="flex items-start py-3">
                  <div>
                    <Counter value={index + 1} variant="outline" />
                  </div>
                  <div className="flex flex-col pl-[10px]">
                    <Text size={19}>{item}</Text>
                  </div>
                </div>
                {showDivider && <InnerDivider />}
              </div>
            )
          })}
        </div>

        {lastItem && (
          <div className="flex py-3">
            <Text size={19}>{lastItem.emoji}</Text>
            <div className="flex flex-col pl-[10px]">
              <Text size={19} weight="semibold">
                {lastItem.label}
              </Text>
              <Text size={19} weight="regular">
                {lastItem.description}
              </Text>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const TabList = (props: ListProps) => {
  const { items, lastItem } = props

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex flex-col">
        {items.map((item, index) => {
          const isFirst = index === 0
          const isSecondLast = index === items.length - 2
          const showDivider =
            index < items.length - 1 || (isSecondLast && lastItem)

          return (
            <div key={item} className="flex flex-col">
              <div className={cx(['flex items-start py-3', isFirst && 'pt-0'])}>
                <div>
                  <Counter value={index + 1} variant="outline" />
                </div>
                <div className="flex flex-col pl-[10px]">
                  <Text size={19}>{item}</Text>
                </div>
              </div>
              {showDivider && <InnerDivider />}
            </div>
          )
        })}
      </div>

      {lastItem && (
        <div className="flex py-3">
          <Text size={19}>{lastItem.emoji}</Text>
          <div className="flex flex-col pl-[10px]">
            <Text size={19} weight="semibold">
              {lastItem.label}
            </Text>
            <Text size={19} weight="regular">
              {lastItem.description}
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}
