import React from 'react'
import styled from '@emotion/styled'
import {
  RadialBarChart,
  RadialBar,
  Legend,
  PolarAngleAxis
} from 'recharts'
import { withStyles, Typography } from '@material-ui/core'

import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import { humanPercentage } from '@/utils/numbers'
import HelpPopover from '@/components/HelpPopover'

const StyledResponsiveContainer = styled.div`
  background-color: #FFF3EB;
  box-shadow: var(--elevation-1);
  border-radius: var(--radius-circle);
  margin: 0 auto;
`

const StyledLegendContainer = styled.div`
  padding-right: 10px;
`

const StyledLegendItem = styled.div`
  height: 21px;
  line-height: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: right;
  margin-left: auto;
  color: var(--color-gray-500);
`

const StyledTypography = withStyles(() => ({
  h2: {
    fontSize: 'var(--text-xl)',
    margin: '20px 0 0'
  }
}))(Typography)

const fillWithPlaceholder = (data, amount) => {
  for (let i = 0; i < amount; i++) {
    data.push({ name: '', dev_value: 0 })
  }

  return data
}

const COLORS = [
  'var(--color-primary-400)',
  'var(--color-primary-300)',
  'var(--color-primary-200)',
  'var(--color-primary-100)',
  'var(--color-primary-50)',
  'var(--color-primary-25)',
  'var(--color-primary-10)',
]

const fillWithColors = (data) => (
  data.map((currentDataPoint, index) => {
    const dataPoint = currentDataPoint

    if (!dataPoint.fill) {
      dataPoint.fill = COLORS[index] ?? ''
    }

    if (!dataPoint.stroke) {
      dataPoint.stroke = COLORS[index] ?? ''
      dataPoint.strokeWidth = 3
    }

    return dataPoint
  })
)

const renderLegend = (props) => {
  const { payload } = props

  return (
    <StyledLegendContainer>
      {
        payload.reverse().map((entry, index) => {
          if (
            !entry.payload?.project_name?.length &&
            entry.payload.dev_value === 0
          ) {
            return false
          }
          const contributions = humanPercentage(entry.payload.dev_value)
          return (
            // eslint-disable-next-line react/no-array-index-key
            <StyledLegendItem key={index} title={entry.payload.project_name}>
              {contributions}%&nbsp;
              {entry.payload.project_name}
            </StyledLegendItem>
          )
        })
      }
    </StyledLegendContainer>
  )
}

export default function RadialTopChart (props) {
  const {
    min = 5,
    title,
    helpContent,
    subtitle
  } = props

  let data = props.data

  if (data.length < min) {
    data = fillWithPlaceholder(data, min - data.length)
  }

  data.sort((a, b) => {
    return b.dev_value - a.dev_value
  })

  const dataPoints = fillWithColors(data)

  return (
    <>
      {
        title
          ? (
            <StyledTypography variant='h2'>
              {title} &nbsp;
              <HelpPopover
                content={helpContent}
                style={{ marginLeft: '8px' }}
              >
                <QuestionCircle width='17.5' height='17.5' />
              </HelpPopover>
            </StyledTypography>
            )
          : (null)
      }
      {subtitle}
      <StyledResponsiveContainer>
        <RadialBarChart
          innerRadius='30%'
          outerRadius='145'
          data={dataPoints.reverse()}
          startAngle={90}
          endAngle={-360}
          margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
          barGap={0}
          barCategoryGap={0}
          width={275}
          height={275}
        >
          <PolarAngleAxis
            type='number'
            domain={[0, 1]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            angleAxisId={0}
            minAngle={0}
            cornerRadius={10}
            dataKey='dev_value'
          />
          <Legend
            iconSize={0}
            height={140}
            layout='vertical'
            verticalAlign='middle'
            wrapperStyle={{
              textAlign: 'right',
              left: 0,
              top: '0',
              fontSize: 'var(--text-xs)',
              width: '50%'
            }}
            content={renderLegend}
          />
        </RadialBarChart>
      </StyledResponsiveContainer>
    </>
  )
}
