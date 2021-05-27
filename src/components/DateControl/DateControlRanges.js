import React from 'react'
import styled from '@emotion/styled'

const StyledRangeListWrapper = styled.div`
  background-color: var(--color-background-orange-400);
`

const StyledRangeList = styled.div`
  max-width: 440px;
  display: flex;
  flex-wrap: wrap;
  margin: 0 15px;
  padding-bottom: 10px;
`

const StyledRangeItem = styled.div`
  transition: .3s ease;
  transition-property: color, background;
  background: var(--color-brand-100);
  border-radius: 4px;
  padding: 2px 6px;
  color: var(--color-brand-400);
  font-size: var(--text-xs);
  margin: 5px;
  cursor: pointer;
  &:hover, &:focus {
    color: #6a2d1b;
    background: var(--color-brand-200);
  }
  &:active {
    color: #000;
    background: var(--color-brand-400);
  }
`

const rangeList = [
  { id: 'past30Days', title: 'Past 30 days' },
  { id: 'thisMonth', title: 'This Month' },
  { id: 'lastMonth', title: 'Last Month' },
  { id: 'last3Months', title: 'Last 3 months' },
  { id: 'last6Months', title: 'Last 6 months' },
  { id: 'thisYear', title: 'This Year' },
  { id: 'pastYear', title: 'Past Year' },
  { id: 'last365Days', title: 'Last 365 days' },
  { id: 'all', title: 'All Time' }
]

export function DateControlRanges (props) {
  const {
    setRange
  } = props

  return (
    <StyledRangeListWrapper>
      <StyledRangeList>
        {
          rangeList.map(({ id, title }) => (
            <StyledRangeItem onClick={() => setRange(id)} key={id}>{title}</StyledRangeItem>
          ))
        }
      </StyledRangeList>
    </StyledRangeListWrapper>
  )
}
