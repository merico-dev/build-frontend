import React from 'react'
import styled from '@emotion/styled'

import { gradeColors } from '@/enums/badge'
import BadgeHistoryPointer from '@/components/BadgeHistory/BadgeHistoryPointer'

const StyledBadgeHistoryContainer = styled.div`
  padding: 1px 0;
`

const StyledBadgeHistory = styled.div`
  position: relative;
  margin: ${({ best }) => (best ? '61px 0 37px' : '0 0 37px')};
`

const StyledBadgeBar = styled.div`
  height: 14px;
  position: relative;
  margin-top: 20px;
`

const StyledBadgePart = styled.div`
  position: absolute;
  background: ${({ background }) => background};
  width: ${({ size }) => size}%;
  top: 0;
  left: 0;
  height: 14px;
  text-align: right;
  border-radius: 8px 0px 0px 8px;
  ${({ border }) => border && `
    border: solid 1px var(--color-gray-100);
    border-radius: 8px;
  `}
`

const StyledBadgeText = styled.div`
  font-size: var(--text-xs);
  transform: translate(13px, -21px);
`

export default function BadgeHistory (props) {
  const {
    best,
    current,
    className,
    grade
  } = props

  return (
    <StyledBadgeHistoryContainer className={className}>
      <StyledBadgeHistory best={best >= 0}>
        {best >= 0 ? (<BadgeHistoryPointer point={best} best top grade={grade} />) : null}
        {current >= 0 ? (<BadgeHistoryPointer point={current} grade={grade} />) : null}
        <StyledBadgeBar>
          <StyledBadgePart
            background={gradeColors.get('tin')}
            size={100}
            border
          />
          <StyledBadgePart
            background={gradeColors.get('iron')}
            size={80}
          >
            <StyledBadgeText>80%</StyledBadgeText>
          </StyledBadgePart>
          <StyledBadgePart
            background={gradeColors.get('bronze')}
            size={50}
          >
            <StyledBadgeText>50%</StyledBadgeText>
          </StyledBadgePart>
          <StyledBadgePart
            background={gradeColors.get('silver')}
            size={25}
          >
            <StyledBadgeText>25%</StyledBadgeText>
          </StyledBadgePart>
          <StyledBadgePart
            background={gradeColors.get('gold')}
            size={10}
          >
            <StyledBadgeText>10%</StyledBadgeText>
          </StyledBadgePart>
        </StyledBadgeBar>
      </StyledBadgeHistory>
    </StyledBadgeHistoryContainer>
  )
}
