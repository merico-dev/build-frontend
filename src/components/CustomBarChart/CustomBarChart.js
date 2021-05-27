import React, { useEffect, useState } from 'react'
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
import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'
import { useTotalCommits } from '@/utils/repositories'
import defaultTickFormatter from '@/utils/chart/defaultTickFormatter'

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

export default function CustomBarChart (props) {
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
    dateFormat = 'M/dd/yy'
  } = props

  const [barSize, setBarSize] = useState(defaultBarSize)
  const [emptyData, setEmptyData] = useState(true)
  const [hasHelp, setHasHelp] = useState(false)
  const [maxValue, setMaxValue] = useState(false)
  const [showLabel, setShowLabel] = useState(true)
  const totalCommits = useTotalCommits(gitUrls)

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
    if (data.length) {
      setHasHelp(
        data.some(({ help }) => help?.text?.length)
      )
      setMaxValue(
        data.reduce((acc, cur) => { return Math.max(acc, cur[valueKey]) }, 0)
      )
      setShowLabel(data.length <= 15)
    }
  }, [data, valueKey])

  useEffect(() => {
    setBarSize(defaultBarSize)
    if (data.length === 0) {
      setEmptyData(true)
    } else {
      setEmptyData(false)
    }
  }, [data, defaultBarSize, valueKey])

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

  const generateBars = () => {
    if (!Array.isArray(valueKey)) {
      return (
        <Bar
          dataKey={valueKey}
          layout={layout}
          barSize={barSize}
          label={showLabel && CustomBarLabel}
          fill='#F0876A'
          isAnimationActive={false}
        />
      )
    }

    return valueKey.map((currentKey) => {
      return (
        <Bar
          key={currentKey}
          dataKey={currentKey}
          layout={layout}
          barSize={barSize}
          label={showLabel && CustomBarLabel}
          fill='#F0876A'
          isAnimationActive={false}
        />
      )
    })
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
            data={data}
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
              content={<CustomTooltip format={dateFormat} />}
            />
            {generateBars()}
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
