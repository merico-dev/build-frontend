import React, { useEffect, useRef, useLayoutEffect, useState } from 'react'
import styled from '@emotion/styled'

const HEATBAR_BASE_WIDTH = 67
const HEATBAR_SAFE_DISTANCE = 15
const BAR_BORDER_DISCOUNT = 2

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: ${({ showAxisLabel }) => (showAxisLabel ? 0 : '9px')};
  padding-right: 12px;
  padding-left: ${({ dataPointWidth }) => dataPointWidth + HEATBAR_SAFE_DISTANCE}px;
  z-index: 1;
  width: ${({ dataPointWidth }) => dataPointWidth + HEATBAR_BASE_WIDTH}px;
`

const StyledBar = styled.div`
  width: 40px;
  border-radius: 20px;
  margin: 10px 0;
  height: ${({ height }) => height}px;
  background: ${({ barBackground }) => barBackground ?? 'linear-gradient(180deg, #ED6A45 0%, #9FA8F9 100%)'};
`

const StyledDataPointWrapper = styled.div`
  position: absolute;
  top: 29px;
  left: 0;
  height: ${({ height }) => height}px;
`

const StyledDataPoint = styled.div`
  transition: bottom .3s;
  position: absolute;
  left: 6px;
  padding: 7px 8px;
  border: 2px solid;
  border-radius: 19px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  box-shadow: var(--elevation-1);
  transform: translateY(${({ marginOffset }) => marginOffset}px);
  background-color: #fff;
  width: ${({ width }) => width}px;
  color: ${({ color }) => color};

  &:before {
    content: '';
    top: 50%;
    left: ${({ width }) => width - BAR_BORDER_DISCOUNT}px;
    right: 0;
    width: 64px;
    background: currentColor;
    height: 2px;
    display: block;
    position: absolute;
    transform: translateY(-1px);
  }

  &:last-of-type {
    z-index: 2;
  }
`

const StyledDataPointText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledBarLabel = styled.div`
  font-size: 1rem;
`

export default function HeatBar (props) {
  const {
    height = 500,
    max,
    series = [],
    barBackground,
    dataPointWidth = 120,
    showAxisLabel = true,
    className,
    marginOffset = 25,
    isRanking
  } = props

  // physical size to dataset size
  const percent = (max > 0) ? height / max : 0

  const [active, setActive] = useState(false)

  const previousPosition = useRef(0)

  useEffect(() => {
    setActive(false)
  }, [series, setActive])

  useLayoutEffect(() => {
    // timer to transition between states
    const timeout = window.setTimeout(() => {
      setActive(true)
    }, 100)

    return () => {
      // clear previous time on unmount
      window.clearTimeout(timeout)
    }
  }, [series, setActive])

  useEffect(() => {
    if (series?.[1]) {
      previousPosition.current = percent * series[1].value
    }
  }, [series, percent])

  if (!series) {
    return null
  }

  const dataPointBottom = (idx, value) => {
    if (isRanking) {
      if (max === 1 || value === 1) {
        return height
      }
      if (value === max) {
        return 0
      }
    }
    return (active && idx !== 0) ? previousPosition.current : percent * value
  }

  return (
    <StyledWrapper dataPointWidth={dataPointWidth} className={className}>
      {showAxisLabel ? <StyledBarLabel>High</StyledBarLabel> : null}
      <StyledBar
        height={height}
        barBackground={barBackground}
      />
      {showAxisLabel ? <StyledBarLabel>Low</StyledBarLabel> : null}
      <StyledDataPointWrapper height={height}>
        {series.map(({ value, label, color = 'var(--color-primary-400)' }, idx) => {
          if (!label) {
            return <></>
          }

          return (
            <StyledDataPoint
              style={{ bottom: dataPointBottom(idx, value) }}
              color={color}
              key={`${value}${label}`}
              width={dataPointWidth}
              marginOffset={marginOffset}
            >
              <StyledDataPointText title={label}>
                {label}
              </StyledDataPointText>
            </StyledDataPoint>
          )
        })}
      </StyledDataPointWrapper>
    </StyledWrapper>
  )
}
