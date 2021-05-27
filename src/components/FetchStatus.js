import React from 'react'
import styled from '@emotion/styled'

import PageLoading from '@/components/PageLoading'
import { FAILED } from '@/store/statusTypes'

const StyledStatus = styled.div`
  ${({ minHeight }) => `min-height:${minHeight}px;`}
  display: inline-flex;
  margin: auto;
  width: 100%;
`

export default function FetchStatus ({
  status,
  minHeight = 0,
  failure = 'Failed to fetch data',
  className
}) {
  if (status === FAILED) {
    return <>{failure}</>
  }

  return (
    <StyledStatus minHeight={minHeight} className={className}>
      <PageLoading />
    </StyledStatus>
  )
}
