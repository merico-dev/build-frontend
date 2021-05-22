import React from 'react'
import { CircularProgress } from '@material-ui/core'
import styled from '@emotion/styled'

const StyledPageLoading = styled.span`
  display: inline-flex;
  margin: auto;
`

export default function PageLoading (props) {
  const {
    size,
    color = 'primary',
    className
  } = props

  return (
    <StyledPageLoading className={className} data-test='loading'>
      <CircularProgress size={size} color={color} />
    </StyledPageLoading>
  )
}
