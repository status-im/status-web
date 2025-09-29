import { cva } from 'class-variance-authority'

import type { IconComponentType } from '~app/_types'

interface Node {
  id: number
  name: string
  icon?: IconComponentType
  count?: number
  children?: Node[]
}

interface TreeNodeProps {
  node: Node
  depth?: number
  toggleNode: (nodeId: number, depth: number) => void
  expandedNodes: number[]
  forceSelection?: boolean
}

const BORDER_COLOR = '#E7EAEE'

const styleNode = cva(
  'relative z-[3] flex w-[184px] items-center justify-center gap-2 whitespace-nowrap rounded-12 border  border-neutral-20 bg-white-100 px-4 py-2 text-15 font-medium shadow-1 transition-colors duration-75',
  {
    variants: {
      hasHoverState: {
        true: 'cursor-auto',
        false: 'cursor-pointer hover:border-neutral-40',
      },
    },
  }
)

function countChildren(node: Node): number {
  let totalCount = 0

  node?.children?.forEach(childNode => {
    if (childNode.count) {
      totalCount += childNode.count
    } else {
      totalCount += 1
    }

    if (childNode?.children) {
      childNode?.children?.forEach(grandChildNode => {
        totalCount += countChildren(grandChildNode)
        if (grandChildNode.count) {
          totalCount += grandChildNode.count
        } else {
          totalCount += 1
        }
      })
    }
  })

  return totalCount
}

const TreeNode = (props: TreeNodeProps) => {
  const { node, depth = 0, toggleNode, expandedNodes, forceSelection } = props

  const handleToggle = () => {
    toggleNode(node.id, depth)
  }

  const isExpanded = expandedNodes[depth] === node.id

  const hasChildren = node.children && node.children.length > 0

  const count = countChildren(node)

  return (
    <div className="z-20 flex flex-col items-center">
      <div className="flex gap-3">
        <div className="relative justify-center">
          {node.count && (
            <div className="absolute left-1/2 top-0 z-[2] -translate-x-1/2">
              <div className="absolute left-1/2 top-[-4px] w-[152px] -translate-x-1/2 rounded-12 border border-neutral-20 bg-white-100 px-4 py-2 shadow-1" />
              <div className="absolute left-1/2 top-[-2px] z-10 w-[168px] -translate-x-1/2 rounded-12 border border-neutral-20 bg-white-100 px-4 py-2 shadow-1" />
            </div>
          )}
          <button
            onClick={handleToggle}
            disabled={!hasChildren}
            className={styleNode({
              hasHoverState: !!node.count || !hasChildren,
            })}
          >
            {node.icon && <node.icon className="shrink-0" />}
            {node.name}
            {node.count && (
              <div className="flex size-4 items-center justify-center rounded-6 bg-neutral-20 text-11">
                {node.count}
              </div>
            )}
          </button>
          {hasChildren && (
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute bottom-[-4px] left-1/2 z-[2] -translate-x-1/2"
            >
              <circle cx="4" cy="4" r="3" fill="white" stroke={BORDER_COLOR} />
            </svg>
          )}
        </div>
      </div>

      <div
        className="vertical-line"
        style={{
          height: '2rem',
          display: forceSelection || !hasChildren ? 'none' : 'block',
        }}
      />

      <button
        onClick={handleToggle}
        className="z-[4] flex gap-2 rounded-20 border border-neutral-20 px-2 py-1"
        style={{
          borderColor: BORDER_COLOR,
          display: hasChildren ? 'block' : 'none',
          pointerEvents: hasChildren ? 'auto' : 'none',
        }}
      >
        <span className="flex size-6 items-center justify-center text-13 font-medium">
          {count}
        </span>
      </button>

      <div
        className="vertical-line"
        style={{
          height: '2rem',
          display:
            forceSelection || (hasChildren && isExpanded)
              ? 'inline-block'
              : 'none',
        }}
      />

      <div className="flex">
        {node.children?.map(childNode => {
          return (
            <div
              key={childNode.id}
              className="node-lines relative mx-auto w-[194px]"
              style={{
                pointerEvents: isExpanded ? 'auto' : 'none',
                display: isExpanded ? 'block' : 'none',
              }}
            >
              <div
                style={{
                  paddingTop: node.children?.length === 1 ? '0px' : '24px',
                }}
              >
                <TreeNode
                  node={childNode}
                  toggleNode={toggleNode}
                  expandedNodes={expandedNodes}
                  depth={depth + 1}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { TreeNode }
