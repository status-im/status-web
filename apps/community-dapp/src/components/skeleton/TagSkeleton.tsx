import React from 'react'
import styled from 'styled-components'
import { Skeleton } from './Skeleton'

export const TagSkeleton = styled(Skeleton)`
  position: relative;
  height: 20px;
  width: 60px;
  padding: 4px 10px;
  background: #fff;
  border: 1px solid #eeeeee;

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    bottom: 4px;
    right: 10px;
    left: 10px;
    background: #eeeeee;
    border-radius: 10px;
  }
`

interface TagsSkeletonListProps {
  tags?: number
  className?: string
}

export const TagsSkeletonList = ({ tags = 4, className }: TagsSkeletonListProps) => (
  <Row className={className}>
    {[...Array(tags)].map((_, index) => (
      <TagSkeleton key={index} />
    ))}
  </Row>
)

const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  & ${TagSkeleton} + ${TagSkeleton} {
    margin-left: 8px;
  }
`
