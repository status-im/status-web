import React, { useState } from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'

import { DoubleTickIcon } from '../../icons/double-tick-icon'
import { styled } from '../../styles/config'
import { Button } from '../button'
import { Flex } from '../flex'
import { IconButton } from '../icon-button'
import { Tooltip } from '../tooltip'

const TabsRoot = styled(TabsPrimitive.Root, {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
})

const TabsList = styled(TabsPrimitive.List, { display: 'flex', gap: '8px' })

const TabsContent = styled(TabsPrimitive.Content, {
  width: '100%',
  height: '100%',
})

const ContentWrapper = styled('div', {
  flex: 1,
  overflowY: 'scroll',
  overflowX: 'hidden',
})

interface Props {
  tabs: Array<{
    title: string
    value: string
    content: JSX.Element | JSX.Element[]
  }>
  actions: Array<{
    icon: JSX.Element
    label: string
    method: (activeTab: string) => void
  }>
}

const Tabs = (props: Props) => {
  const [activeTab, setActiveTab] = useState('all')

  const initialValue: {
    triggers: JSX.Element[]
    contents: JSX.Element[]
  } = {
    triggers: [],
    contents: [],
  }
  const { triggers, contents } = props.tabs.reduce((results, currentTab) => {
    results.triggers.push(
      <TabsPrimitive.Trigger
        key={currentTab.value}
        value={currentTab.value}
        asChild
      >
        <Button size="small" variant="secondary">
          {currentTab.title}
        </Button>
      </TabsPrimitive.Trigger>
    )
    results.contents.push(
      <TabsContent key={currentTab.value} value={currentTab.value}>
        {currentTab.content}
      </TabsContent>
    )

    return results
  }, initialValue)

  const actions = props.actions.map(action => {
    return (
      <Tooltip key={action.label} label={action.label} arrowOffset={7}>
        <IconButton
          label={action.label}
          onClick={() => {
            action.method(activeTab)
          }}
        >
          <DoubleTickIcon />
        </IconButton>
      </Tooltip>
    )
  })

  return (
    <TabsRoot value={activeTab} onValueChange={setActiveTab}>
      <Flex
        css={{
          height: '64px',
          padding: '13px 16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* todo?: if all empty, disable other tabs */}
        {/* todo?: if active, disable hover and clicks */}
        <TabsList>{triggers}</TabsList>
        <div>{actions}</div>
      </Flex>
      <ContentWrapper>{contents}</ContentWrapper>
    </TabsRoot>
  )
}

export { Tabs }
