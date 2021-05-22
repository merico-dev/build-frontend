import React from 'react'
import styled from '@emotion/styled'

const StyledLineChartTooltip = styled.div`
  display: grid;
  ${({ columns }) => `grid-template-columns: 1fr repeat(${columns}, auto);`}
`

const StyledLineChartTableFeatured = styled.div`
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 0 8px;
  ${({ align = 'center' }) => `text-align: ${align};`}
  ${({ color = 'var(--color-gray-400)' }) => `color: ${color};`}
  display: flex;
  align-items: center;
`

const StyledLineChartTableCell = styled.div`
  text-align: center;
  font-size: var(--text-xxs);
  ${({ color = 'var(--color-gray-400)' }) => `color: ${color};`}
  padding: 7px 0 6px;
`

const StyledLineChartSingleValue = styled.div`
  text-align: center;
  font-weight: bold;
  color: var(--color-primary-400);
`

export default function LineChartTooltip (props) {
  const {
    rows,
    columns,
    valueKey,
    single
  } = props

  if (single) {
    return (
      <StyledLineChartSingleValue>
        {rows[0]?.payload[valueKey] ?? '-'}
      </StyledLineChartSingleValue>
    )
  }

  return (
    <StyledLineChartTooltip columns={columns.length}>
      <StyledLineChartTableFeatured />
      {
        columns.map(({ name, title }) => (
          <StyledLineChartTableFeatured key={name}>
            {title}
          </StyledLineChartTableFeatured>
        ))
      }
      {rows.map((row) => {
        return (
          <React.Fragment key={row.name}>
            <StyledLineChartTableFeatured
              align='left'
              color={row.color}
            >
              {row.name}
            </StyledLineChartTableFeatured>
            {
              columns.map(({ name }, index) => {
                const property = name === valueKey ? 'value' : name
                return (
                  <StyledLineChartTableCell color={row.color} key={index}>
                    {row.payload[property] ?? '-'}
                  </StyledLineChartTableCell>
                )
              })
            }
          </React.Fragment>
        )
      })}
    </StyledLineChartTooltip>
  )
}
