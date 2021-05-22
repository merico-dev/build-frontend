import React from 'react'
import styled from '@emotion/styled'

import { mdMedia } from '@/styles/snippets/responsive'

const StyledPageContainer = styled.div`
  padding: 20px;

  ${mdMedia(`
    padding: 40px 50px;
  `)}
`

export default function PageContainer (props) {
  const {
    children
  } = props

  return (
    <StyledPageContainer>
      {React.Children.map(children, (children) => children)}
    </StyledPageContainer>
  )
}
