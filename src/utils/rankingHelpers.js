import { getColorGenerator } from 'charts'
import { colorSet } from '@/enums/colors'

export const generateRankMarkLines = (data, bottom = 1) => {
  const markLines = data.map((value, index) => {
    return [
      { yAxis: value, xAxis: index },
      { yAxis: bottom, xAxis: index }
    ]
  })
  return markLines
}

export const calcBottomMarkline = (height) => {
  const TOP_Y_DISCOUNT = 28
  const y = String(Number(height.replace('px', '')) - TOP_Y_DISCOUNT)

  return [
    { x: 31, y },
    { x: '100%', y }
  ]
}

export const generateSeries = (values, max, height, selectedSeries) => {
  const colors = getColorGenerator(null, colorSet)
  const symbolSize = values.length > 1 ? 8 : 14
  return values.map((value, key) => {
    const color = colors.next().value
    return {
      animation: false,
      symbol: 'circle',
      symbolSize,
      type: 'line',
      // stack: 'total',
      label: {
        show: selectedSeries === key,
        fontSize: 16,
        fontWeight: 600,
        color
      },
      itemStyle: {
        color0: color,
        color
      },
      lineStyle: {
        color
      },
      data: value,
      markLine: {
        silent: true,
        symbol: 'none',
        lineStyle: {
          type: 'solid',
          color: 'var(--color-gray-100)',
        },
        label: { show: false },
        data: [
          ...generateRankMarkLines(value, max),
          calcBottomMarkline(height)
        ]
      }
    }
  })
}
