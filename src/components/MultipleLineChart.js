import React, { useCallback } from 'react'
import {
  Typography,
  makeStyles,
  IconButton
} from '@material-ui/core'
import { MultipleSeriesLineChart, getColorGenerator } from 'charts'

import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import { colorSet } from '@/enums/colors'
import { FAILED, SUCCEED } from '@/store/statusTypes'
import { DateTime } from 'luxon'
import { humanPercentage } from '@/utils/numbers'
import { useTotalCommits } from '@/utils/repositories'
import { emptyMessageTypes } from '@/enums/emptyMessageTypes'
import HelpPopover from '@/components/HelpPopover'
import FetchStatus from '@/components/FetchStatus'
import LineChartTooltip from '@/components/LineChartTooltip'
import EmptyChart from '@/components/Empty/EmptyChart'
import StyledLineChart from '@/components/LineChart/StyledLineChart'
import CustomChartTooltip from '@/components/CustomChartTooltip/CustomChartTooltip'
import defaultTickFormatter from '@/utils/chart/defaultTickFormatter'

const useStyles = makeStyles((theme) => ({
  h3: {
    marginBottom: '26px',
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: 'var(--text-xl)'
    }
  },
  yLabel: {
    color: 'var(--color-gray-400)',
    fontWeight: 'bold'
  }
}))

const getRepositoryColor = (repositories, repository) => {
  if (!repositories?.length) { return null }
  // TODO: match by gitUrl when backend return it to devValueByTeam
  return repositories.find(({ name }) => name === repository.name)?.color || null
}

const standarizedSeries = (
  data,
  valueKey,
  dateKey,
  percentage = false,
  repositories
) => {
  const colors = getColorGenerator(null, colorSet)
  return data.map((series) => {
    const color = getRepositoryColor(repositories, series.repository) || colors.next().value
    const dataSet = series?.dataSet
      ? series.dataSet.map((dataPoint) => {
        const value = dataPoint[valueKey]
        return {
          ...dataPoint,
          value: (
            percentage
              ? humanPercentage(value)
              : Number(value)
          ),
          date: DateTime.fromISO(dataPoint[dateKey]).toFormat('M/dd/yy')
        }
      })
      : []

    return {
      ...series,
      dataSet,
      color
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
              <QuestionCircle width='17.5' hight='17.5' />
            </IconButton>
          </HelpPopover>
        )
      }
    </Typography>
  )
}

const renderEmptyState = (messageType, heading) => {
  return (
    <>
      {heading}
      <EmptyChart
        xAxisTitle='Dev Share(%)'
        messageType={messageType}
        margin={{
          top: '13px'
        }}
      />
    </>
  )
}

export default function MultipleLineChart (props) {
  const {
    data = [],
    gitUrls = [],
    status,
    yAxis,
    title,
    help,
    percentage,
    valueKey = 'value',
    dateKey = 'date',
    tooltipColumns,
    repositories = [],
    height = '283px',
    yDomain,
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

  const isEmpty = (!data.length ||
    data.reduce((acc, cur) => acc + cur.dataSet?.length, 0) === 0)

  const tooltipContent = useCallback(({ payload }) => {
    return nextGenTooltip
      ? (
        <CustomChartTooltip
          rows={payload}
          columns={tooltipColumns || [
            { name: valueKey, title: 'Value', featured: true },
          ]}
          valueKey={valueKey}
        />
        )
      : (
        <LineChartTooltip
          rows={payload}
          columns={tooltipColumns || [
            { name: valueKey, title: 'Value', featured: true },
          ]}
          valueKey={valueKey}
        />
        )
  }, [nextGenTooltip, valueKey, tooltipColumns])

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
    seriesDataKey: 'dataSet',
    seriesNameKey: 'repository$.name',
    seriesNameFormatter: (series) => `${series.repository.name}`,
    labelKey: 'date',
    legend: {
      enabled: false
    },
    margin: { top: 5, left: 0, bottom: 5, right: 0 },
    valueKey: 'value',
    tooltip: {
      show: true,
      content: tooltipContent,
      // Freezes the tooptip onClick
      // onClick: () => {}
      // excludedNames: seriesWithTheme.map((row) => row.repository.name),
    },
    labelFormatter: (value, index) => {
      return tickFormatter
        ? tickFormatter(props, value, index)
        : defaultTickFormatter(interval, value)
    },
    connectNulls: true
  }

  const heading = (
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
              style={{ marginLeft: '7.5px' }}
              aria-label='More information'
            >
              <QuestionCircle width='17.5' hight='17.5' />
            </IconButton>
          </HelpPopover>
        )
      }
    </Typography>
  )

  if (status === FAILED) {
    return renderEmptyState(emptyMessageTypes.failure, heading)
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
    return renderEmptyState(totalCommits > 0
      ? emptyMessageTypes.noData
      : emptyMessageTypes.noCommits, heading)
  }

  return (
    <>
      {heading}
      <StyledLineChart>
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
        <div style={{ height }}>
          <MultipleSeriesLineChart
            series={seriesWithTheme}
            configurations={configurations}
            empty={false}
          />
        </div>
      </StyledLineChart>
    </>
  )
}
