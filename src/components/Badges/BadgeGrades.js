import React from 'react'
import styled from '@emotion/styled'
import { gradeColors } from '@/enums/badge'

const StyledBadgeGrades = styled.div`
  font-size: var(--text-xs);
  display: flex;
  font-weight: var(--text-semibold);
  flex-wrap: wrap;

  > div {
    margin-right: 10px;
  }
`

const StyledBadgeGrade = styled.div`
  color: var(--color-gray-500);
  display: flex;
  line-height: 12px;
  &:before {
    content: '';
    margin: 0 8px 0 8px;
    width: 20px;
    height: 12px;
    background: ${({ color }) => color};
    border-radius: var(--radius-xs);
  }
  &:first-of-type {
    &:before {
      margin-left: 0;
    }
  }
`

export default function BadgeGrades (props) {
  return (
    <StyledBadgeGrades>
      <StyledBadgeGrade color={gradeColors.get('gold')}>
        Top 10%
      </StyledBadgeGrade>
      <StyledBadgeGrade color={gradeColors.get('silver')}>
        Top 10-25%
      </StyledBadgeGrade>
      <StyledBadgeGrade color={gradeColors.get('bronze')}>
        Top 25-50%
      </StyledBadgeGrade>
      <StyledBadgeGrade color={gradeColors.get('iron')}>
        Top 50-80%
      </StyledBadgeGrade>
    </StyledBadgeGrades>
  )
}
