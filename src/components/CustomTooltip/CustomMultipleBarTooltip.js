import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import CustomChartLegendIcon from '../CustomChartLegend/CustomChartLegendIcon'
import { getColorGenerator } from 'charts'
import { colorSet } from '@/enums/colors'
import { getTitleByInterval } from '@/utils/chart/defaultTickFormatter'

const StyledCustomTooltip = styled.div`
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-lg);
  padding: 8px 9px;
  color: var(--color-gray-400);
  font-size: var(--text-xs);
  background: #fff;
  text-align: right;
  width: 220px;
  box-shadow: var(--elevation-1);
`

const StyledCustomChartTooltip = styled.div`
  display: grid;
  grid-template-columns: 1fr 52px;
  column-gap: 10px;
`

const StyledLineChartTableCell = styled.div`
  color: var(--color-gray-400);
  text-align: ${({ align }) => align ?? 'right'};
  font-size: var(--text-xs);
  padding: 7px 0 6px;
  ${({ marginLeft }) => marginLeft && `margin-left: ${marginLeft};`}
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  white-space: nowrap;
`

export default function CustomMultipleBarTooltip (props) {
  const {
    tooltipProps,
    projectList
  } = props

  const {
    active,
    payload: barData,
    label,
    interval,
  } = tooltipProps[0]

  const totals = useMemo(() => {
    if (!projectList?.length || !barData?.length) {
      return 0
    }

    return projectList?.reduce((acc, cur) => {
      const key = 'MERGES_' + cur.gitUrl
      const rowValue = barData?.[0]?.payload?.[key] || 0
      return acc + rowValue
    }, 0)
  }, [barData, projectList])

  if (!active || !barData?.length) {
    return null
  }

  const colors = getColorGenerator(null, colorSet)

  return (
    <StyledCustomTooltip>
      <div>{getTitleByInterval(label, interval, 'ISO')}</div>
      <StyledCustomChartTooltip>
        <>
          <StyledLineChartTableCell align='left' marginLeft='13px'>
            Total
          </StyledLineChartTableCell>
          <StyledLineChartTableCell align='right'>
            {totals}
          </StyledLineChartTableCell>
        </>
        {projectList?.map((project, idx) => {
          const key = 'MERGES_' + project.gitUrl
          const rowValue = barData?.[0]?.payload?.[key] || 0
          const color = project.color || colors.next().value
          return (
            <React.Fragment key={idx}>
              <StyledLineChartTableCell
                align='left'
                color={color}
              >
                <CustomChartLegendIcon
                  type='Bar'
                  color={color}
                />
                {project.repoName}
              </StyledLineChartTableCell>
              <StyledLineChartTableCell
                color={color}
                align='right'
              >
                {rowValue}
              </StyledLineChartTableCell>
            </React.Fragment>
          )
        })}
      </StyledCustomChartTooltip>
    </StyledCustomTooltip>
  )
}
