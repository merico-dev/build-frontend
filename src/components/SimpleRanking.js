import React from 'react'
import { DateTime } from 'luxon'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'zrender/lib/svg/svg'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/markLine'
import { useMediaQuery, useTheme } from '@material-ui/core'

import EmptyChart from '@/components/Empty/EmptyChart'

const generateRankMarkLines = (data, bottom = 1) => {
  const lines = data.map((value, index) => {
    return [
      { yAxis: value, xAxis: index },
      { yAxis: Number(bottom), xAxis: index }
    ]
  })

  return lines
}

const calcBottomMarkline = (height) => {
  const TOP_Y_DISCOUNT = 28
  const y = String(Number(height.replace('px', '')) - TOP_Y_DISCOUNT)

  return [
    { x: 29, y },
    { x: '100%', y }
  ]
}

export default function SimpleRanking (props) {
  const {
    height = '267px',
    data = [],
    min = 1,
    max,
    onSeriesClick = () => {}
  } = props

  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))

  if (!data.length) {
    return (
      <EmptyChart />
    )
  }

  const sortedData = data.sort((a, b) => {
    const dateA = DateTime.fromISO(a.date)
    const dateB = DateTime.fromISO(b.date)

    return dateA.diff(dateB)
  })

  const values = sortedData.map((dataPoint) => {
    return dataPoint.rank === 0 ? max : dataPoint.rank
  })

  return (
    <ReactEchartsCore
      echarts={echarts}
      onEvents={{
        click: (event) => {
          if (event.componentType === 'series') {
            onSeriesClick(event)
          }
        }
      }}
      option={{
        grid: {
          left: (!matches) ? '60px' : '25px',
          right: (!matches) ? '60px' : '25px',
          bottom: '3%',
          top: '30px',
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
            type: 'none',
            label: {
              show: false
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
              show: true,
              lineStyle: {
                color: '#DEDFE3'
              }
            },
            axisTick: {
              inside: true,
              lineStyle: {
                color: '#DEDFE3'
              }
            },
            splitLine: {
              show: false,
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
              })
            },
            boundaryGap: false,
            data: sortedData.map((dataPoint) => dataPoint.date)
          }
        ],
        yAxis: [
          {
            offset: !matches ? 60 : 25,
            type: 'value',
            axisLabel: {
              fontSize: 13,
              margin: 10,
              color: '#717484',
              formatter: (value, index) => {
                const SPACES = '     '
                if (index !== 0 && value !== max) return SPACES
                return `#${value}`
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DEDFE3'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: true,
              inside: true
            },
            inverse: true,
            min,
            max: max >= 2 ? max : 2,
            boundaryGap: false
          }
        ],
        series: [
          {
            symbol: 'circle',
            symbolSize: 14,
            type: 'line',
            stack: 'total',
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 600,
              color: '#ED6A45'
              // 'LA'
            },
            itemStyle: {
              color0: '#ED6A45',
              color: '#ED6A45'
            },
            lineStyle: {
              color: '#F0876A'
            },
            data: values,
            markLine: {
              silent: true,
              symbol: 'none',
              lineStyle: {
                type: 'solid',
                color: '#DEDFE3',

              },
              label: { show: false },
              data: [
                // { type: 'average', name: 'Line Marker', valueIndex: 0 },
                ...generateRankMarkLines(values, max),
                calcBottomMarkline(height)
              ]
            }
          }
        ],
        markLine: {
          zlevel: 0,
          z: 0
        }
      }}
      style={{ height, width: '100%' }}
      className='react_for_echarts'
      opts={{ renderer: 'svg' }}
    />
  )
}
