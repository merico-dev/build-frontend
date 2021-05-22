import React from 'react'
import styled from '@emotion/styled'

import { ReactComponent as Crown } from '@/icons/crown.svg'

const CrownColors = new Map([
  [1, 'var(--color-gold)'],
  [2, 'var(--color-silver)'],
  [3, 'var(--color-brass)'],
])

const CircleColors = new Map([
  [1, 'var(--color-primary-400)'],
  [2, 'var(--color-primary-300)'],
  [3, 'var(--color-primary-200)'],
  [4, 'var(--color-primary-100)']
])

const StyledCrownComponent = styled.div`
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 14px;
  color: ${({ position }) => CrownColors.get(position) ?? ''};
`

const StyledCrownTitle = styled.span`
  position: absolute;
  top: 8px;
  text-align: center;
  color: #fff;
  font-size: 0.5rem;
  width: 100%;
`

const StyledTopRankAvatar = styled.div`
  position: relative;
  width: 50px;
  height: 50px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #fff;
  border: solid 3px ${({ position }) => CircleColors.get(position) ?? 'var(--color-primary-50)'};
  color: var(--color-primary-400);
`

const StyledTitle = styled.div`
  font-size: 0.5rem;
`

const StyledValue = styled.div`
font-size: 0.9rem;
font-weight: bold;
`

export default function TopRankingAvatar (props) {
  const {
    position,
    value,
    className
  } = props

  const CrownComponent = (
    <StyledCrownComponent position={position}>
      <StyledCrownTitle>{position}</StyledCrownTitle>
      <Crown width={16} height={14} />
    </StyledCrownComponent>
  )

  return (
    <StyledTopRankAvatar position={position} className={className}>
      {position <= 3 ? CrownComponent : null}
      <StyledTitle>Top</StyledTitle>
      <StyledValue>{value}%</StyledValue>
    </StyledTopRankAvatar>
  )
}
