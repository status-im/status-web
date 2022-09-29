import React, { useState } from 'react'

import * as TabsPrimitive from '@radix-ui/react-tabs'

import { MarkAllAsReadIcon } from '../../icons/mark-all-as-read-icon'
import { Button } from '../button'
import { Flex } from '../flex'
import { IconButton } from '../icon-button'
import { Tooltip } from '../tooltip'

const Tabs = (props: {
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
}) => {
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
      <TabsPrimitive.Content
        key={currentTab.value}
        value={currentTab.value}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {currentTab.content}
      </TabsPrimitive.Content>
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
          <MarkAllAsReadIcon />
        </IconButton>
      </Tooltip>
    )
  })

  return (
    <TabsPrimitive.Root
      value={activeTab}
      onValueChange={setActiveTab}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Flex
        style={{
          height: '64px',
          padding: '13px 16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* todo?: if all empty, disable other tabs */}
        {/* todo?: if active, disable hover and clicks */}
        <TabsPrimitive.List style={{ display: 'flex', gap: '8px' }}>
          {triggers}
        </TabsPrimitive.List>
        <div>{actions}</div>
      </Flex>
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          overflowY: 'scroll',
        }}
      >
        {contents}
      </div>
    </TabsPrimitive.Root>
  )
}

export { Tabs }
