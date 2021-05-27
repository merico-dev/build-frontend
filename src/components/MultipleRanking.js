import React, { useState } from 'react'
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
import { generateSeries } from '@/utils/rankingHelpers'
import Legend from '@/components/Legend'

export default function MultipleRanking (props) {
  const {
    height = '267px',
    data,
    min = 1,
    max,
    dates
  } = props

  const [selectedSeries, setSelectedSeries] = useState(null)
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('sm'))

  if (!data.length) {
    return (
      <EmptyChart />
    )
  }

  const values = data.map((value) => value.dataSet?.map((dataPoint) => {
    return dataPoint.rank === 0 ? max : dataPoint.rank
  }) || [])

  const eventHandler = (event) => {
    if (event.componentType === 'series') {
      setSelectedSeries(event.seriesIndex)
    }
  }

  const onEvents = {
    mouseover: eventHandler
  }

  return (
    <>
      <ReactEchartsCore
        echarts={echarts}
        onEvents={onEvents}
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
          /* tooltip: {
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
          }, */
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
                formatter: (v) => DateTime.fromISO(v).toFormat('M/yy')
              },
              boundaryGap: false,
              data: dates,
              triggerEvent: true
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
              max,
              boundaryGap: false
            }
          ],
          series: generateSeries(values, max, height, selectedSeries),
          markLine: {
            zlevel: 0,
            z: 0
          }
        }}
        style={{ height, width: '100%' }}
        className='react_for_echarts'
        opts={{ renderer: 'svg' }}
      />
      <Legend data={data} />
    </>
  )
}
