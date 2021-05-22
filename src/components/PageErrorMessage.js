
import React from 'react'
import styled from '@emotion/styled'

const StyledTitle = styled.h1`
  color: var(--color-gray-500);
  font-size: 3.25rem;
  margin: 110px 0 80px;
  font-weight: var(--text-semibold);
`

const StyledSubtitle = styled.div`
  color: var(--color-gray-500);
  font-weight: var(--text-semibold);
  font-size: var(--text-xxl);
  margin-bottom: 80px;
`

export default function PageErrorMessage (props) {
  const {
    title,
    text,
    className
  } = props

  return (
    <div className={className}>
      <StyledTitle>{title} :/</StyledTitle>
      <StyledSubtitle>{text}</StyledSubtitle>
    </div>
  )
}
