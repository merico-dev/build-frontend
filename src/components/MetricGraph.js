import React from 'react'
import {
  Typography,
  IconButton,
  Box
} from '@material-ui/core'
import styled from '@emotion/styled'

import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'

import {
  getDataLastValue,
  getDataRangeVariation
} from '@/utils/dataHandling/dataHandling'
import LineChart from '@/components/LineChart'
import HelpPopover from '@/components/HelpPopover'
import Variation from '@/components/Variation'
import { FAILED, SUCCEED } from '@/store/statusTypes'
import FetchStatus from '@/components/FetchStatus'
import EmptyChart from '@/components/Empty/EmptyChart'
import { emptyMessageTypes } from '@/enums/emptyMessageTypes'
import { useTotalCommits } from '@/utils/repositories'

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

const MetricFeaturedVariation = styled.div`
  width: 100%;
  font-size:30px;
  font-weight:600;
  text-align:right;
`

const StyledFetchStatus = styled(FetchStatus)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ height }) => height || '110px'};
`

export default function MetricGraph (props) {
  const {
    status,
    yLabel,
    title,
    helpContent,
    helpLink,
    showVariation = true,
    height,
    featured,
    showMinLabel = true,
    subtitle = null,
    data = [],
    xAxis,
    yAxis,
    yMax = null,
    gitUrl = '',
    variant
  } = props

  const totalCommits = useTotalCommits([gitUrl])

  const yTitle = yLabel
    ? (
      <Typography variant='body2' color='textSecondary' component='div'>
        <strong>{yLabel.title}</strong>&nbsp;&nbsp;
        {yLabel.help
          ? (
            <HelpPopover
              content={yLabel.help}
              moreLink={yLabel.more}
            >
              <IconButton
                size='small'
                aria-label='More information'
              >
                <QuestionCircle width='17.5' hight='17.5' />
              </IconButton>
            </HelpPopover>
            )
          : null}
      </Typography>
      )
    : null

  const lastValue = getDataLastValue(data, yAxis?.key)
  const change = getDataRangeVariation(data, lastValue, yAxis?.key)

  const featuredData = featured
    ? (
      <>
        <Box marginLeft='auto' color='var(--color-gray-400)'>{lastValue}</Box>
        {
        showVariation && (
          <MetricFeaturedVariation>
            <Variation variation={change} arrowSize={20} positive={Math.sign(change) !== -1}>
              {Number(change.toFixed(2))}%
            </Variation>
          </MetricFeaturedVariation>
        )
      }
      </>
      )
    : (
      <Typography
        variant='body1'
        style={{ marginLeft: 'auto' }}
      >
        {
        showVariation && (
          <Variation variation={change} positive={Math.sign(change) !== -1}>
            {Number(change.toFixed(2))}%
          </Variation>
        )
      }
      </Typography>
      )

  const chartContent = data?.length
    ? (
      <LineChart
        height={height}
        showMinLabel={showMinLabel}
        data={data}
        xAxis={xAxis}
        yAxis={yAxis}
        yMax={yMax}
      />
      )
    : (
      <EmptyChart
        xAxisTitle={yTitle}
        messageType={totalCommits > 0
          ? emptyMessageTypes.noData
          : emptyMessageTypes.noCommits}
        margin={{
          top: '13px'
        }}
        variant={variant}
      />
      )

  const heading = (
    <MetricHeader>
      <Typography variant='h3'>
        {title}
      </Typography>
      {subtitle}
      {helpContent
        ? (
          <HelpPopover
            content={helpContent}
            moreLink={helpLink}
          >
            <IconButton
              size='small'
              style={{ marginLeft: '7.5px' }}
              aria-label='More information'
            >
              <QuestionCircle width='17.5' hight='17.5' />
            </IconButton>
          </HelpPopover>
          )
        : null}
      {data.length ? featuredData : null}
    </MetricHeader>
  )

  if (status === FAILED) {
    return (
      <>
        {heading}
        <EmptyChart
          variant={variant}
          xAxisTitle={yTitle}
          messageType={emptyMessageTypes.failure}
          margin={{
            top: '13px'
          }}
        />
      </>
    )
  }

  if (status !== SUCCEED) {
    return (
      <>
        {heading}
        <StyledFetchStatus
          height={height}
          status={status}
          variant={variant}
          showChart
        />
      </>
    )
  }

  return (
    <>
      {heading}
      <Box marginTop={featured ? '0' : '13px'}>
        {data.length ? yTitle : null}
        {chartContent}
      </Box>
    </>
  )
}
