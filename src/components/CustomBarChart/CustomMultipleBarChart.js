/* eslint-disable */
import React, { useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import PageLoading from '@/components/PageLoading'
import EmptyMessage from '@/components/Empty/EmptyMessage'
import { emptyMessageTypes } from '@/enums/emptyMessageTypes'
import CustomBarChartRating from '@/components/CustomBarChart/CustomBarChartRating'
import CustomBarLabel from '@/components/CustomBarChart/CustomBarLabel'
import CustomBarHelp from '@/components/CustomBarChart/CustomBarHelp'
import EmptyChart from '@/components/Empty/EmptyChart'
import CustomMultipleBarTooltip from '@/components/CustomTooltip/CustomMultipleBarTooltip'
import { useTotalCommits } from '@/utils/repositories'
import defaultTickFormatter from '@/utils/chart/defaultTickFormatter'
import { getColorGenerator } from 'charts'
import { colorSet } from '@/enums/colors'
import CustomChartTooltip from '../CustomChartTooltip/CustomChartTooltip'

const StyledDetailsGraph = styled.div`
  position: relative;
  box-sizing: border-box;
  padding: 0;
`

const StyledNoData = styled.div`
  max-width: 240px;
  margin: 18px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledLoader = styled.div`
  width: 40px;
  height: 40px;
  display: block;
  margin: 18px auto;
`

const StyledHelpIcons = styled.div`
  margin-top: -12px;
  margin-left: 30px;
  max-width: 100%;
  display: flex;
  justify-content: space-around;
  text-align: center;
`

function getLeftMarginFromMaxValue (maxValue) {
  if (maxValue >= 90000) {
    return -10
  } else if (maxValue > 8000) {
    return -15
  } else if (maxValue > 800) {
    return -20
  } else {
    return -30
  }
}

const renderEmptyState = (xAxisTitle, messageType, variant, interval) => {
  return (
    <>
      <EmptyChart
        xAxisTitle={xAxisTitle}
        messageType={messageType}
        variant={variant}
        height='285px'
        interval={interval}
      />
    </>
  )
}

const BarChartMultipleTooltip = (props, projectList) => {
  return (
    <CustomMultipleBarTooltip
      projectList={projectList}
      tooltipProps={props}
    />
  )
}

export default function CustomMultipleBarChart (props) {
  const {
    height = 284,
    defaultBarSize = 20,
    layout = 'horizontal',
    data = [],
    isFetching = false,
    showEmptyGraph = true,
    showRating = false,
    className,
    tickFormatter,
    interval = 'custom',
    valueKey = 'value',
    gitUrls = [],
    dateKey = 'name',
    dateFormat = 'M/dd/yy',
    dataSetKey = 'dataSet'
  } = props

  const colors = getColorGenerator(null, colorSet)

  const [emptyData, setEmptyData] = useState(true)
  const [hasHelp, setHasHelp] = useState(false)
  const [maxValue, setMaxValue] = useState(false)
  const [showLabel, setShowLabel] = useState(true)
  const totalCommits = useTotalCommits(gitUrls)

  const consolidatedData = useMemo(() => {
    try {
      // first we flat all data and add repo info
      const bars = data.map((dataItem) => {
        return dataItem?.merges?.map((mergeItem) => {
          return {
            gitUrl: dataItem.gitUrl,
            repoName: dataItem.repoName,
            url: dataItem.url,
            ...mergeItem
          }
        }) || []
      }).flat()
      // then we get an object with each prop representing a date
      const reducedBars = bars.reduce((acc, cur, idx) => {
        if (!acc[cur.date]) {
          acc[cur.date] = {}
        }
        acc[cur.date][`MERGES_${cur.gitUrl}`] = cur.merged
        return acc
      }, {})

      // finally we loop through each date and transform it into an array
      const finalBars = Object.keys(reducedBars).map((mappedKey) => {
        return {
          date: mappedKey,
          ...reducedBars[mappedKey]
        }
      })

      return finalBars
    } catch (e) {
      console.error('Unable to consolidate chart data', e)
      return []
    }
  }, [data])

  let margin = props.margin
  if (!margin) {
    margin = {
      top: 15,
      right: 0,
      left: getLeftMarginFromMaxValue(maxValue),
      bottom: 5,
    }
  }

  useEffect(() => {
    if (data?.length >= 1) {
      setHasHelp(
        data.some(({ help }) => help?.text?.length)
      )
      setMaxValue(
        Math.max(
          ...data.map(
            (dataItem) => {
              return dataItem?.[dataSetKey]?.reduce((acc, cur) => { return Math.max(acc, cur[valueKey]) }, 0) || 0
            }
          )
        )
      )
      setShowLabel(data[0].length <= 15)
    } else {
      setHasHelp(
        data.some(({ help }) => help?.text?.length)
      )
      setMaxValue(
        data.reduce((acc, cur) => { return Math.max(acc, cur[valueKey]) }, 0)
      )
      setShowLabel(data.length <= 15)
    }
  }, [data, valueKey, dataSetKey])

  useEffect(() => {
    if (data.some(dataItem => dataItem?.[dataSetKey]?.length > 0)) {
      setEmptyData(false)
    } else {
      setEmptyData(true)
    }
  }, [data, valueKey, dataSetKey])

  if (isFetching) {
    return <StyledLoader><PageLoading size={40} /></StyledLoader>
  }

  if (!showEmptyGraph && ((!isFetching && data.length === 0) || data.some((bar) => bar[valueKey] === undefined))) {
    return (<StyledNoData><EmptyMessage type={emptyMessageTypes.noData} title='No data' /></StyledNoData>)
  }

  if (showEmptyGraph && emptyData) {
    return renderEmptyState(
      null,
      totalCommits > 0
        ? emptyMessageTypes.noData
        : emptyMessageTypes.noCommits,
      'lg',
      interval
    )
  }

  return (
    <StyledDetailsGraph className={className}>
      {
          showRating && (
            <CustomBarChartRating
              height={height}
              emptyData={emptyData}
            />
          )
        }
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width='99.8%' height='100%'>
          <BarChart
            height={height}
            layout={layout}
            data={consolidatedData}
            margin={margin}
          >
            <CartesianGrid
              vertical={false}
            />
            <XAxis
              dataKey={dateKey}
              fontSize={14}
              tick={{ fill: '#717484' }}
              interval='preserveStartEnd'
              tickFormatter={
                (value, index) => {
                  return tickFormatter
                    ? tickFormatter(props, value, index)
                    : defaultTickFormatter(interval, value, dateFormat)
                }
              }
              stroke='#DEDFE3'
              allowDecimals={false}
            />
            <YAxis
              tick={{ fill: '#717484' }}
              fontSize={14}
              stroke='none'
              yAxisId={0}
              allowDecimals={false}
            />
            {/* <Tooltip /> */}
            <Tooltip
              cursor={{ fill: 'rgba(200,200,200,0.2)' }}
              wrapperStyle={{
                borderRadius: '5px',
                overflow: 'hidden'
              }}
              contentStyle={{
                padding: '5px',
                borderRadius: '5px',
                color: 'var(--color-gray-400)',
                fontSize: 'var(--text-sm)'
              }}
              content={(...props) => BarChartMultipleTooltip(props, data)}
            />
            {
              data.map((project, idx) => {
                return (
                  <Bar
                    key={idx}
                    dataKey={`MERGES_${project.gitUrl}`}
                    layout={layout}
                    barSize={defaultBarSize}
                    label={showLabel && CustomBarLabel}
                    fill={colors.next().value}
                    isAnimationActive={false}
                    stackId='a'
                  />
                )
              })
            }
        </BarChart>
        </ResponsiveContainer>
      </div>
      {
          hasHelp && (
            <StyledHelpIcons>
              {
                data.map(({ help }, idx) => (
                  <CustomBarHelp
                    key={idx}
                    text={help?.text}
                    link={help?.link}
                  />
                ))
              }
            </StyledHelpIcons>
          )
        }
    </StyledDetailsGraph>
  )
}
