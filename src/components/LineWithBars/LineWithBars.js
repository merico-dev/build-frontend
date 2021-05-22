import React, { useMemo, useState } from 'react'
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  // Area,
  Bar,
  Line,
  ResponsiveContainer
} from 'recharts'

import CustomBarLabel from '@/components/CustomBarChart/CustomBarLabel'
import CustomBarShape from '@/components/CustomBarChart/CustomBarShape'
import CustomTooltip from '@/components/CustomTooltip/CustomTooltip'
import EmptyChart from '@/components/Empty/EmptyChart'
import { emptyMessageTypes } from '@/enums/emptyMessageTypes'
import { FAILED, LOADING } from '@/store/statusTypes'
import FetchStatus from '@/components/FetchStatus'
import defaultTickFormatter from '@/utils/chart/defaultTickFormatter'

const yLabelCustomize = {
  tick: {
    fontSize: 'var(--text-xs)'
  },
  axisLine: false,
  tickMargin: 23,
  tickLine: false,
  transform: 'translate(0, -1)'
}

export default function LineWithBars (props) {
  const {
    height = '283px',
    data = [],
    interval = 'day',
    valueKey = 'contributors',
    tickFormatter,
    status
  } = props

  const [changeMin, setChangeMin] = useState(0)
  const [changeMax, setChangeMax] = useState(0)

  const changeData = useMemo(() => {
    return data.reduce((acc, cur, idx) => {
      let change = 0
      const accVal = Number(acc[acc.length - 1]?.[valueKey])
      const curVal = Number(cur?.[valueKey])
      if (
        !Number.isNaN(accVal) &&
        !Number.isNaN(curVal)
      ) {
        change = cur?.[valueKey] - acc[acc.length - 1]?.[valueKey]
      }

      setChangeMin((changeMin) => change < changeMin ? change : changeMin)
      setChangeMax((changeMax) => change > changeMax ? change : changeMax)

      return [
        ...acc,
        {
          ...cur,
          change,
          [valueKey]: curVal
        }
      ]
    }, [])
  }, [data, valueKey])

  if (status === LOADING) {
    return (
      <FetchStatus
        status={status}
        minHeight={261}
      />
    )
  }

  if (status === FAILED) {
    return (
      <EmptyChart
        variant='md'
        messageType={emptyMessageTypes.failure}
      />
    )
  }

  if (!changeData?.length) {
    return (
      <EmptyChart
        variant='md'
        messageType={emptyMessageTypes.noData}
      />
    )
  }

  const changeDomain = -changeMin > changeMax
    ? [changeMin, -changeMin]
    : [-changeMax, changeMax]

  return (
    <div style={{ height }}>
      <ResponsiveContainer width='99.8%' height='100%'>
        <ComposedChart data={changeData}>
          <XAxis
            dataKey='date'
            tickFormatter={
              (value, index) => {
                return tickFormatter
                  ? tickFormatter(props, value, index)
                  : defaultTickFormatter(interval, value, 'ISO')
              }
            }
            tick={{
              fontSize: 'var(--text-xs)'
            }}
          />
          <YAxis
            yAxisId={0}
            allowDecimals={false}
            {...yLabelCustomize}
          />
          <YAxis
            yAxisId={1}
            orientation='right'
            interval='preserveStartEnd'
            allowDecimals={false}
            domain={[
              changeDomain[0] - 5,
              changeDomain[1] + 5,
            ]}
            hide
            // padding={{ top: 40, bottom: 40 }}
            {...yLabelCustomize}
          />
          <Tooltip content={<CustomTooltip interval={interval} format='ISO' />} />
          <CartesianGrid
            stroke='var(--color-gray-100)'
            vertical={false}
          />
          <Line
            yAxisId={0}
            type='monotone'
            dataKey={valueKey}
            stroke='#ff7300'
            dot={false}
          />
          <Bar
            yAxisId={1}
            dataKey='change'
            barSize={20}
            fill={() => 'url(#splitColor)'}
            label={CustomBarLabel}
            shape={CustomBarShape}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
