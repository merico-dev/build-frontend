import styled from '@emotion/styled'
import React from 'react'
import CustomChartLegendIcon from '@/components/CustomChartLegend/CustomChartLegendIcon'

const StyledCustomChartLegend = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--text-xs);
  color: var(--color-gray-400);
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`

const StyledCustomChartLegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  ${({ justifySelf }) => justifySelf && `justify-self: ${justifySelf};`}
`

function CustomChartLegendItem (props) {
  const {
    type,
    label,
    align = 'flex-start',
    color
  } = props

  return (
    <StyledCustomChartLegendItem justifySelf={align} key={label}>
      <CustomChartLegendIcon
        type={type}
        color={color}
      />
      {label}
    </StyledCustomChartLegendItem>
  )
}

export default function CustomChartLegend (props) {
  const {
    data = []
  } = props

  return (
    <StyledCustomChartLegend>
      {data.map(CustomChartLegendItem)}
    </StyledCustomChartLegend>
  )
}
