import React from 'react'

export default function CustomBarLabel (props) {
  const { x, y = 0, value } = props

  if (value === 0) return null

  return (
    <text
      x={x + 9}
      y={value > 0 ? y - 19 : y}
      dy={12}
      dx={0}
      fontSize='12'
      fill={value < 1 ? 'var(--color-gray-300)' : 'var(--color-primary-400)'}
      textAnchor='middle'
    >
      {value}
    </text>
  )
}
