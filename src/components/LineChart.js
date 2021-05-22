import React from 'react'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'zrender/lib/svg/svg'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import { DateTime } from 'luxon'

export default function LineChart (props) {
  const {
    height = '220px',
    showMinLabel,
    data = [],
    xAxis,
    yAxis,
    yMax
  } = props

  const values = data.map((dataPoint) => dataPoint[yAxis?.key ?? 'value'])

  const config = {
    grid: {
      left: '10px',
      right: '23px',
      bottom: '3%',
      top: '25px',
      containLabel: true
    },
    title: {
      text: 'Velocity'
    },
    tooltip: {
      showContent: false,
      trigger: 'axis',
      formatter: '{c}',
      axisPointer: {
        type: 'line',
        label: {
          fontSize: '18px',
          color: '#F0876A',
          backgroundColor: 'rgba(0,0,0,0)',
          margin: -283,
          show: true,
          formatter: (labelData) => {
            const {
              seriesData: [
                firstSeries = ''
              ] = []
            } = labelData

            return firstSeries.value
          }
        },
        lineStyle: {
          color: '#717484',
          width: 2
        }
      }
    },
    xAxis: [
      {
        type: 'category',
        axisLine: {
          show: false
        },
        axisTick: {
          inside: true,
          lineStyle: {
            color: '#DEDFE3'
          }
        },
        axisLabel: {
          color: '#717484',
          fontSize: 10,
          formatter: (v) => DateTime.fromISO(v).toLocaleString({
            day: '2-digit',
            year: '2-digit',
            month: '2-digit'
          }),
          interval: values.length <= 4 ? 0 : 3
        },
        boundaryGap: false,
        data: data.map((dataPoint) => dataPoint[xAxis?.key ?? 'date'])
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          showMinLabel,
          fontSize: 12,
          color: '#717484'
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#DEDFE3'
          }
        },
        axisTick: {
          show: false,
        },
        boundaryGap: [0, '80%'],
        max: yMax
      }
    ],
    series: [
      {
        symbol: 'none',
        name: 'a',
        type: 'line',
        stack: 'total',
        lineStyle: {
          color: '#F0876A'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 0.8, [{
            offset: 0,
            color: 'rgb(255,219,194)'
          }, {
            offset: 1,
            color: 'rgba(255,219,194,0)'
          }])
        },
        data: values
      }
    ]
  }

  if (values.length === 1) {
    config.series[0].symbol = 'circle'
    config.series[0].symbolSize = 11
  }

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={config}
      style={{ height, width: '100%' }}
      className='react_for_echarts'
      opts={{ renderer: 'svg' }}
    />
  )
}
