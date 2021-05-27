import styled from '@emotion/styled'
import React from 'react'

const StyledCustomChartLegendIcon = styled.div`
  width: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  ${({ color }) => color ? `color: ${color};` : 'color: var(--color-primary-400);'}
`

const StyledBarIcon = styled.div`
  width: 100%;
  height: 10px;
  background-color: currentColor;
  border-radius: var(--radius-xs);
`

const StyledLineIcon = styled.div`
  width: 100%;
  height: 1px;
  background-color: currentColor;
`

export default function CustomChartLegendIcon ({ type, color }) {
  return (
    <StyledCustomChartLegendIcon color={color}>
      {type === 'Bar'
        ? <StyledBarIcon />
        : <StyledLineIcon />}
    </StyledCustomChartLegendIcon>
  )
}
