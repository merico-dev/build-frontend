import React from 'react'
import {
  RadarChart
} from 'charts'
import styled from '@emotion/styled'

const StyledCustomRadarChart = styled.div`
  ${({ width }) => width && `width: ${width};`}
  ${({ height }) => height && `height: ${height};`}
`

export default function CustomRadarChart (props) {
  const {
    data,
    customConfigurations,
    width = '431px',
    height = '309px'
  } = props
  const configurations = {
    angleField: 'metricName',
    radiusField: 'value',
    seriesField: 'name',
    radiusAxis: {
      grid: {
        line: { type: 'line' },
      },
      min: 0,
      max: 100,
    },
    line: { visible: true },
    point: {
      visible: true,
      shape: 'circle',
    },
    legend: {
      visible: false
    },
    appendPadding: false,
    valueFormatter: (v) => v,
    ...customConfigurations
  }
  return (
    <StyledCustomRadarChart width={width} height={height}>
      <RadarChart data={data} configurations={configurations} />
    </StyledCustomRadarChart>
  )
}
