import React, { useCallback } from 'react'
import styled from '@emotion/styled'
import {
  Typography,
  makeStyles,
  IconButton
} from '@material-ui/core'
import { SingleSeriesLineChart } from 'charts'

import { ReactComponent as ExclamationCircle } from '@/icons/exclamation-circle.svg'
import { FAILED, SUCCEED } from '@/store/statusTypes'
import { DateTime } from 'luxon'
import { humanPercentage } from '@/utils/numbers'
import { useTotalCommits } from '@/utils/repositories'
import { emptyMessageTypes } from '@/enums/emptyMessageTypes'
import HelpPopover from '@/components/HelpPopover'
import FetchStatus from '@/components/FetchStatus'
import LineChartTooltip from '@/components/LineChartTooltip'
import EmptyChart from '@/components/Empty/EmptyChart'
import { getDataLastValue, getDataRangeVariation } from '@/utils/dataHandling/dataHandling'
import Variation from '@/components/Variation'
import StyledLineChart from '@/components/LineChart/StyledLineChart'
import CustomChartTooltip from '@/components/CustomChartTooltip/CustomChartTooltip'
import defaultTickFormatter from '@/utils/chart/defaultTickFormatter'

const MetricFeaturedVariation = styled.div`
  width: 100%;
  font-size:30px;
  font-weight:600;
  text-align:right;
`

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 26px;
`

const useStyles = makeStyles((theme) => ({
  h3: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: 'var(--text-xl)'
    }
  },
  yLabel: {
    color: 'var(--color-gray-400)',
    fontWeight: 'bold'
  },
  helpIcon: {
    color: 'var(--color-gray-200)',
    marginLeft: '7.5px'
  }
}))

const standarizedSeries = (
  data,
  valueKey,
  dateKey,
  percentage = false,
) => {
  return data.map((dataPoint) => {
    const numberValue = Number(dataPoint[valueKey])
    const value =
      !Number.isNaN(numberValue)
        ? numberValue
        : 0
    return {
      ...dataPoint,
      value: (
        percentage
          ? humanPercentage(value)
          : Number(value.toFixed(2))
      ),
      date: DateTime.fromISO(dataPoint[dateKey]).toFormat('M/dd/yy')
    }
  })
}

const CustomLabel = (props) => {
  const {
    title,
    help
  } = props
  const classes = useStyles()
  return (
    <Typography variant='body2' className={classes.yLabel}>
      {title}
      {
        help?.text && (
          <HelpPopover
            content={help.text}
            moreLink={help?.link}
          >
            <IconButton
              size='small'
              style={{ marginLeft: '5.5px' }}
              aria-label='More information'
            >
              <ExclamationCircle width='21' hight='21' />
            </IconButton>
          </HelpPopover>
        )
      }
    </Typography>
  )
}

const renderEmptyState = (xAxisTitle, messageType, heading, variant) => {
  return (
    <>
      {heading}
      <EmptyChart
        xAxisTitle={xAxisTitle}
        messageType={messageType}
        margin={{
          top: '13px'
        }}
        variant={variant}
      />
    </>
  )
}

export default function SingleLineChart (props) {
  const {
    data = [],
    height = 285,
    gitUrls = [],
    status,
    yAxis,
    title,
    help,
    percentage,
    valueKey = 'value',
    dateKey = 'date',
    repositories = [],
    showVariation,
    yDomain,
    featured,
    variant,
    showHeading = true,
    nextGenTooltip = true,
    tickFormatter,
    interval = 'day'
  } = props
  const classes = useStyles()
  const totalCommits = useTotalCommits(gitUrls)
  const seriesWithTheme = standarizedSeries(
    data,
    valueKey,
    dateKey,
    percentage,
    repositories
  )
  const lastValue = getDataLastValue(data, valueKey)
  const change = getDataRangeVariation(data, lastValue, valueKey)
  const isEmpty = !data.length
  const tooltipContent = useCallback(({ payload }) => {
    return nextGenTooltip
      ? (
        <CustomChartTooltip
          rows={payload}
          valueKey={valueKey}
          single
        />
        )
      : (
        <LineChartTooltip
          rows={payload}
          valueKey={valueKey}
          single
        />
        )
  }, [nextGenTooltip, valueKey])

  const configurations = {
    cartesianGrid: {
      horizontal: true,
      vertical: false,
    },
    cartesianGridStyle: {
      stroke: '#DEDFE3'
    },
    interpolationType: 'monotoneX',
    yAxis: {
      tickLine: false,
      axisLine: false,
      tickMargin: 13
    },
    yDomain,
    xAxis: {
      fillGaps: true,
      axisLine: false,
      tickLine: { stroke: '#DEDFE3', strokeWidth: 1, transform: 'translate(0 -5)', orientation: 'top' },
      tickMargin: 5,
      // opt-out to the chart library intervals
      interval: ''
    },
    renderDot: (props) => {
      return seriesWithTheme?.length === 1 && (
        <circle
          r={props.r + 2}
          cx={props.cx}
          cy={props.cy}
          style={{ fill: '#c23531' }}
          key={props.index}
          stroke='0'
        />
      )
    },
    extraAreas: [
      // {
      //   name: 'backgroundDrop',
      //   fill: 'url(#background)',
      //   stroke: 'none',
      // },
    ],
    labelKey: 'date',
    legend: {
      enabled: false
    },
    margin: { top: 5, left: 0, bottom: 5, right: 0 },
    valueKey,
    tooltip: {
      show: true,
      content: tooltipContent,
    },
    labelFormatter: (value, index) => {
      return tickFormatter
        ? tickFormatter(props, value, index)
        : defaultTickFormatter(interval, value)
    },
    connectNulls: true
  }

  const featuredData = featured
    ? (
      <>
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

  const heading = (
    <MetricHeader>
      <Typography
        variant='h3'
        className={classes.h3}
      >
        {title}
        {
        help && (
          <HelpPopover
            content={help.text}
            moreLink={help.link}
          >
            <IconButton
              size='small'
              aria-label='More information'
              className={classes.helpIcon}
            >
              <ExclamationCircle width='21' hight='21' />
            </IconButton>
          </HelpPopover>
        )
      }
      </Typography>
      {data.length ? featuredData : null}
    </MetricHeader>
  )

  if (status === FAILED) {
    return renderEmptyState(yAxis?.label?.title, emptyMessageTypes.failure, heading, variant)
  }

  if (status !== SUCCEED) {
    return (
      <FetchStatus
        status={status}
        minHeight={372}
      />
    )
  }

  if (isEmpty) {
    return renderEmptyState(yAxis?.label?.title, totalCommits > 0
      ? emptyMessageTypes.noData
      : emptyMessageTypes.noCommits, heading, variant)
  }

  const definitions = [
    () => (
      <linearGradient key='background' id='background' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='5%' stopColor='rgb(255,219,194)' stopOpacity={0.8} />
        <stop offset='95%' stopColor='rgba(255,219,194,0)' stopOpacity={0} />
      </linearGradient>
    ),
  ]

  return (
    <>
      {showHeading && heading}
      <StyledLineChart height={height}>
        {
          yAxis?.label?.title && (
            <CustomLabel
              title={yAxis.label.title}
              help={{
                text: yAxis.label?.helpText,
                link: yAxis.label?.helpLink,
              }}
            />
          )
        }
        <SingleSeriesLineChart
          data={seriesWithTheme}
          configurations={configurations}
          empty={false}
          definitions={definitions}
        />
      </StyledLineChart>
    </>
  )
}
