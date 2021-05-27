import React, { Suspense } from 'react'
import styled from '@emotion/styled'

import Panel from '@/layouts/Panel'
import PageLoading from '@/components/PageLoading'
import { mdMedia } from '@/styles/snippets/responsive'

const StyledPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  .TermsSidebar {
    display: none;
  }

  @media screen and (min-width: 1280px) {
    align-items: flex-start;
    .TermsSidebar {
      display: block;
    }
  }
`

export const StyledTermsContent = styled.div`
  flex-basis: 830px;
  padding: 20px 20px 0;

  ${mdMedia(`
    padding: 70px 0 0 0;
  `)}
`

export default function TermsPanel (props) {
  const {
    children,
    sidebar = true,
    isAuthenticated = false
  } = props

  return (
    <Panel
      sidebar={sidebar}
      isAuthenticated={isAuthenticated}
    >
      <Suspense fallback={<PageLoading />}>
        <StyledPageWrapper>
          {children}
        </StyledPageWrapper>
      </Suspense>
    </Panel>
  )
}
