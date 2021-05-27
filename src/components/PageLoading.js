import React from 'react'
import { CircularProgress } from '@material-ui/core'
import styled from '@emotion/styled'

const StyledPageLoading = styled.span`
  display: inline-flex;
  margin: auto;
  ${({ textAlign }) => textAlign && `text-align: ${textAlign};`}
`

export default function PageLoading (props) {
  const {
    size,
    color = 'primary',
    className,
    textAlign = 'left'
  } = props

  return (
    <StyledPageLoading className={className} data-test='loading'>
      <CircularProgress size={size} color={color} textAlign={textAlign} />
    </StyledPageLoading>
  )
}
