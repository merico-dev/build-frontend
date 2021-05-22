import React from 'react'
import styled from '@emotion/styled'

import { ReactComponent as Arrow } from '@/icons/arrow.svg'

const StyledVariation = styled.div`
  font-size: var(--text-xl);
  color: var(--color-gray-400);
  font-weight: var(--text-semibold);
  margin-left: 10px;
  display: flex;
  align-items: center;
`

const StyledArrow = styled(Arrow)`
  margin-right: 4px;
  color: #F83E3E;

  ${({ positive }) => positive && `
    color: #3ECF27;
    transform: scaleY(-1);
  `}
`

const StyledSame = styled.div`
  margin-right: 4px;
  height: 3px;
  width: 14px;
  background-color: var(--color-gray-300);
`

export default function CustomDataGridVariation (props) {
  const {
    showChange,
    variation
  } = props

  const sign = showChange
    ? (
      <StyledArrow width={15} height={12} /> || <StyledSame />
      )
    : null

  return (
    <StyledVariation>
      {sign}
      {variation}
    </StyledVariation>
  )
}
