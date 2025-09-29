'use client'

import './org-chart.css'

import { useState } from 'react'

import { useElementOnCenter } from '~hooks/use-element-on-center'

import { FOUNDERS, TEAM } from './data'
import { TreeNode } from './tree-node'

const OrgChart = () => {
  const { ref } = useElementOnCenter()

  // We start with Status Lead node expanded
  const [expandedNodes, setExpandedNodes] = useState<number[]>([10])

  const toggleNode = (nodeId: number, depth: number) => {
    setExpandedNodes(prev => {
      // Keep only the nodes up to the current depth
      const newExpanded = prev.slice(0, depth)

      // Add the new node ID if it's not already in the array at the current depth
      if (newExpanded[depth] !== nodeId) {
        newExpanded[depth] = nodeId
      }

      // if the node has children and it's already expanded, collapse it
      if (expandedNodes.includes(nodeId)) {
        newExpanded.splice(newExpanded.indexOf(nodeId), 1)
      }

      return newExpanded
    })
  }

  return (
    <div ref={ref} className="w-full overflow-auto scrollbar-none">
      <div className="mx-auto flex min-w-max px-[400px]">
        <div className="flex w-full flex-col items-center">
          <div className="flex flex-col">
            <div className="flex flex-row gap-2">
              {FOUNDERS.map(founder => (
                <TreeNode
                  key={founder.id}
                  node={founder}
                  toggleNode={toggleNode}
                  expandedNodes={expandedNodes}
                  forceSelection
                />
              ))}
            </div>
            <div className="relative flex justify-center">
              <svg
                width="98"
                height="65"
                viewBox="0 0 98 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="translate-x-px"
              >
                <path
                  d="M1 0V19.2C1 23.6804 1 25.9206 1.87195 27.6319C2.63893 29.1372 3.86278 30.3611 5.36808 31.1281C7.07937 32 9.31958 32 13.8 32H84.2C88.6804 32 90.9206 32 92.6319 32.8719C94.1372 33.6389 95.3611 34.8628 96.1281 36.3681C97 38.0794 97 40.3196 97 44.8V64.5"
                  stroke="#E7EAEE"
                />
              </svg>
              <svg
                width="98"
                height="65"
                viewBox="0 0 98 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="-translate-x-px"
              >
                <path
                  d="M97 0V19.2C97 23.6804 97 25.9206 96.1281 27.6319C95.3611 29.1372 94.1372 30.3611 92.6319 31.1281C90.9206 32 88.6804 32 84.2 32H13.8C9.31958 32 7.07937 32 5.36808 32.8719C3.86278 33.6389 2.63893 34.8628 1.87195 36.3681C1 38.0794 1 40.3196 1 44.8V64.5"
                  stroke="#E7EAEE"
                />
              </svg>
            </div>
          </div>
          <div className="relative flex">
            {TEAM.map(child => {
              return (
                <div key={child.id} className="node-lines relative w-[195px]">
                  <div
                    style={{
                      paddingTop: 24,
                    }}
                  >
                    <TreeNode
                      node={child}
                      toggleNode={toggleNode}
                      expandedNodes={expandedNodes}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export { OrgChart }
