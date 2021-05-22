import React from 'react'

const RADIUS = 45
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function RadialProgress ({ progress }) {
  return (
    <svg
      width='300'
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
    >
      <circle
        cx='50%'
        cy='50%'
        r='45%'
        strokeWidth='8%'
        stroke='var(--color-background-orange)'
        fill='transparent'
      />
      <circle
        cx='50%'
        cy='50%'
        r='45%'
        strokeWidth='8%'
        stroke='var(--color-primary-400)'
        fill='transparent'
        strokeLinecap='round'
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={CIRCUMFERENCE * (1 - (progress / 100))}
      />
    </svg>
  )
}
