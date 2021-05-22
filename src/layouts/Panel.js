import React from 'react'
import styled from '@emotion/styled'
import { useRouteMatch } from 'react-router-dom'

import { mdMedia } from '@/styles/snippets/responsive'
import Topbar from '@/components/Topbar'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import CookieWarning from '@/components/CookieWarning'
import { useSelector } from 'react-redux'
import { SUCCEED } from '@/store/statusTypes'

const StyledSidebarWrapper = styled.div`
  margin-top: -60px;
  z-index: 7;
  position: relative;
  max-width: 220px;
  display: none;
  ${mdMedia(`
    display: flex;
  `)}
`

const StyledTopbarWrapper = styled.div`
  flex: 100% 1 0;
  height: 60px;
  grid-area: header;
`

const StyledFooterWrapper = styled.div`
  margin-top: auto;
`

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(auto, 220px) 1fr;
  grid-template-areas:
    'header header'
    'content content';
  grid-template-rows: 60px auto;
  flex-basis: 100%;
  overflow: hidden;

  ${mdMedia('overflow: visible;')}
`

const StyledContentWrapper = styled.div`
  display:flex;
  flex-direction:column;
  width: var(--content-width-without-sidebar);

  ${({ sidebar }) => mdMedia(!sidebar
        ? `
          width: var(--content-width-without-sidebar);
          grid-area: content;
        `
        : 'width: var(--content-width-with-sidebar);'
    )
  };

`

export default function Panel (props) {
  const {
    children,
    sidebar = true,
    ContentClassname,
    topbarProps = {}
  } = props

  const {
    status: userStatus
  } = useSelector(state => state.user)

  const isOpenPage = useRouteMatch({
    path: '/(team|contact|privacy|contact|terms|login)',
    exact: true
  })

  return (
    <Layout>
      <StyledTopbarWrapper>
        <Topbar
          showLogo={!sidebar}
          isPublic={!sidebar}
          isAuthenticated={userStatus === SUCCEED}
          {...topbarProps}
        />
      </StyledTopbarWrapper>
      {sidebar && (
        <StyledSidebarWrapper><Sidebar /></StyledSidebarWrapper>
      )}
      <StyledContentWrapper sidebar={sidebar} className={ContentClassname}>
        {React.Children.map(children, (children) => children)}
        <StyledFooterWrapper>
          <Footer isOpenPage={isOpenPage} />
        </StyledFooterWrapper>
      </StyledContentWrapper>
      <CookieWarning />
    </Layout>
  )
}
