import React from 'react'
import styled from 'styled-components'
import { Skeleton } from './Skeleton'

export const TextRow = () => {
  const widths = ['35%', '20%', '45%']

  return (
    <Row>
      {widths
        .sort(() => Math.random() - 0.5)
        .map((width, index) => (
          <Skeleton key={index} width={width} height="12px" />
        ))}
    </Row>
  )
}

export const TextBlock = ({ rows = 3 }: { rows?: number }) => (
  <>
    {[...Array(rows)].map((_, index) => (
      <TextRow key={index} />
    ))}
  </>
)

const Row = styled.div`
  display: flex;
  align-items: center;

  & + & {
    margin-top: 8px;
  }

  & ${Skeleton} + ${Skeleton} {
    margin-left: 8px;
  }
`
