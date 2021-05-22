import React from 'react'
import styled from '@emotion/styled'
import CustomChartLegendIcon from '@/components/CustomChartLegend/CustomChartLegendIcon'
import { getTitleByInterval } from '@/utils/chart/defaultTickFormatter'

const StyledCustomChartTooltip = styled.div`
  display: grid;
  ${({ columns }) => `grid-template-columns: 1fr repeat(${columns}, auto);`}
  column-gap: 10px;
`

const StyledLineChartTableCell = styled.div`
  color: var(--color-gray-400);
  text-align: ${({ align }) => align ?? 'right'};
  font-size: var(--text-xs);
  font-family: 'Source Sans Pro';
  padding: 7px 0 6px;
  display: inline-flex;
  align-items: center;
  ${({ marginLeft }) => marginLeft && `margin-left: ${marginLeft};`}
  ${({ justifyContent }) => justifyContent && `justify-content: ${justifyContent};`}
  width: 100%;
`

const StyledLineChartSingleValue = styled.div`
  text-align: right;
  color: var(--color-gray-400);
  font-family: 'Source Sans Pro';
  padding: 6px 0 6px;
`

export default function CustomChartTooltip (props) {
  const {
    rows = [],
    columns = [],
    valueKey,
    dateKey = 'date',
    single,
    type = 'line',
    interval = 'day'
  } = props

  if (single) {
    return (
      <StyledLineChartSingleValue>
        {getTitleByInterval(
          rows[0]?.payload?.[dateKey],
          interval
        )}<br />
        {rows[0]?.payload[valueKey] ?? '-'}
      </StyledLineChartSingleValue>
    )
  }

  const totals = rows?.length > 1 && columns?.length
    ? columns.map(({ name }, index) => {
      const property = name === valueKey ? 'value' : name
      return (
        <StyledLineChartTableCell key={index}>
          {rows.reduce((acc, cur) => {
            return Number(acc) + Number(cur?.payload?.[property] || 0)
          }, 0)}
        </StyledLineChartTableCell>
      )
    })
    : null

  return (
    <>
      {
        rows[0]?.payload?.[dateKey] !== undefined && (
          <StyledLineChartTableCell justifyContent='flex-end'>
            {getTitleByInterval(
              rows[0]?.payload?.[dateKey],
              interval
            )}
          </StyledLineChartTableCell>
        )
      }
      <StyledCustomChartTooltip columns={columns?.length || 0}>
        {
          totals && (
            <>
              <StyledLineChartTableCell align='left' marginLeft='13px'>
                Total
              </StyledLineChartTableCell>
              {totals}
            </>
          )
        }
        {rows?.map((row) => {
          return (
            <React.Fragment key={row.name}>
              <StyledLineChartTableCell
                align='left'
                color={row.color}
              >
                <CustomChartLegendIcon
                  type={type}
                  color={row.color}
                />
                {row.name}
              </StyledLineChartTableCell>
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
      </StyledCustomChartTooltip>
    </>
  )
}
