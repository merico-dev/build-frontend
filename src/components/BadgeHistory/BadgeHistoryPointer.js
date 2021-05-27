import React from 'react'
import styled from '@emotion/styled'

const StyledBadgeHistoryPointer = styled.div`
  z-index: 2;
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: ${({ left }) => left}%;
  transform: translateX(-50%);
  top: ${({ top }) => (top ? '-55px' : '20px')};
`

const StyledBest = styled.div`
  position: absolute;
  transform: translateY(-5px);
  background: var(--color-primary-400);
  border-radius: var(--radius-xs);
  height: 12px;
  width: 26px;
  font-size: 10px;
  color: #fff;
  display: inline-flex;
  top: 0;
  align-items: center;
  justify-content: center;
`

const StyledBadgeHistoryContent = styled.div`
  text-align: center;
  width: 80px;
  height: 30px;
  background: #fff;
  color: ${({ best }) => (best ? 'var(--color-primary-400)' : 'var(--color-gray-400)')};
  border: 1px solid;
  border-radius: 19px;
  box-shadow: var(--elevation-1);
  padding: 6px 11px;
  font-size: var(--text-xs);
  font-weight: var(--text-semibold);
  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 1px;
    height: 68px;
    left: 50%;
    z-index: -1;
    ${({ best }) => (best
      ? `
      background-color: var(--color-primary-400);
    `
    : `
      background-color: var(--color-gray-400);
    `)};
    ${({ top }) => (!top && `
      bottom: 0;
      height: 56px;
    `)};
  }
`

export default function BadgeHistoryPointer (props) {
  const {
    best,
    top,
    point,
    grade
  } = props

  if (!grade?.length) {
    return null
  }

  return (
    <StyledBadgeHistoryPointer left={point} top={top} role='mark'>
      {best && (<StyledBest>Best</StyledBest>)}
      <StyledBadgeHistoryContent
        best={best} top={top}
      >{
      `${grade?.toString()?.charAt(0)?.toUpperCase()}${grade?.toString()?.toLowerCase()?.slice(1, grade.length)}`
      }
      </StyledBadgeHistoryContent>
    </StyledBadgeHistoryPointer>
  )
}
