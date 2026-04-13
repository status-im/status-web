import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Colors } from '../constants/styles'
import filterIcon from '../assets/images/filter.svg'
import arrowDownIcon from '../assets/images/arrowDown.svg'

export type FilterListProps = {
  value: number
  setValue: (value: number) => void
  options: { value: number; text: string }[]
}

export const FilterList = ({ value, setValue, options }: FilterListProps) => {
  const [isOpened, setIsOpened] = useState(false)

  useEffect(() => {
    window.addEventListener('click', () => setIsOpened(false))
    return () => {
      window.removeEventListener('click', () => setIsOpened(false))
    }
  }, [])

  return (
    <Filter
      onClick={(e) => {
        e.stopPropagation()
        setIsOpened(!isOpened)
      }}
    >
      <Select>
        <SelectTrigger>{options.find((option) => option.value === value)?.text}</SelectTrigger>
        <SelectOptions className={isOpened ? 'opened' : undefined}>
          {options.map((option, key) => (
            <SelectOption
              className={option.value === value ? 'selected' : ''}
              key={key}
              onClick={() => setValue(option.value)}
            >
              {option.text}
            </SelectOption>
          ))}
        </SelectOptions>
      </Select>
    </Filter>
  )
}

const Filter = styled.button`
  display: flex;
  align-items: center;
  height: 36px;
  position: relative;
  padding-left: 5px;
  padding-right: 1px;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${Colors.VioletDark};
  border: 1px solid #e6ecf0;
  border-radius: 14px;
  appearance: none;
  outline: none;

  &:focus,
  &:active {
    border: 1px solid ${Colors.Violet};
  }
`

const Select = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`
const SelectTrigger = styled.div`
  position: relative;
  min-width: 167px;
  padding: 0 28px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    font-size: 0;
    min-width: unset;
  }

  &::before {
    content: '';
    width: 24px;
    height: 24px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    background-image: url(${filterIcon});
  }

  &::after {
    content: '';
    width: 24px;
    height: 24px;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    background-image: url(${arrowDownIcon});
  }
`
const SelectOptions = styled.div`
  position: absolute;
  display: block;
  width: 175px;
  top: calc(100% + 11px);
  right: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.3s;
  border: 1px solid ${Colors.GrayBorder};
  border-radius: 16px 4px 16px 16px;

  &.opened {
    opacity: 1;
    background: ${Colors.White};
    visibility: visible;
    pointer-events: all;
    z-index: 10;
  }
`
const SelectOption = styled.span`
  position: relative;
  display: block;
  width: 100%;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  text-align: center;
  padding: 11px 0;
  cursor: pointer;
  transition: all 0.3s;

  &:first-child {
    border-radius: 16px 4px 0 0;
  }

  &:last-child {
    border-radius: 0 0 16px 16px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid ${Colors.GrayBorder};
  }

  &:hover {
    background: ${Colors.Violet};
    color: ${Colors.White};
  }

  &.selected {
    @media (max-width: 600px) {
      background: ${Colors.Violet};
      color: ${Colors.White};
    }
  }
`
