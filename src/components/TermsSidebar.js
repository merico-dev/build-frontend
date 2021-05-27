/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { useState, useLayoutEffect } from 'react'
import styled from '@emotion/styled'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import BackToDashboardLink from '@/components/BackToDashboardLink'
import { dashboardLink } from '@/utils/dashboardLink'

const StyledTermsSidebarWrapper = styled.div`
  --sidebarCurrentDistanceTop: 60px;
  flex-basis: 400px;
  min-width: 400px;
  background: var(--color-secondary-400);
  color: var(--color-background);
  position: relative;
  padding: 170px 50px;
  height: calc(100vh - var(--sidebarCurrentDistanceTop));
  top: var(--sidebarCurrentDistanceTop);
  left: 0;
  position: fixed;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    transition: all .3s;
    width: 12px;
    background-color: transparent;
    padding-left: 8px;
  }
  &:hover {
    ::-webkit-scrollbar {
      padding-left: 0px;
    }
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--color-primary-400);
    border-radius: 6px;

    &:hover {
      background-color: var(--color-primary-300);
    }
  }
  ${({ topbarInView }) => {
    if (!topbarInView) {
      return 'height: 100vh;top: 0 !important;'
    }
    return ''
  }}
`

const StyledTermsSidebar = styled.div`
  position: relative;
  max-width: 250px;
  overflow: hidden;
  font-size: var(--text-lg);
  &:before {
    content: '';
    position: absolute;
    left: 6px;
    top: 6px;
    height: calc(100% - 32px);
    width: 1px;
    background-color: var(--color-primary-300);
  }

  a:not(.small), span {
    display: grid;
    align-items: flex-start;
    grid-template-columns: 13px 1fr;
    gap: 19px;
    margin-bottom: 38px;
    position: relative;

    + .small {
      margin-bottom: 16px;
      margin-top: -21px;
    }

    &, & a {
      color: inherit;
      text-decoration: none;
    }
    &:before {
      color: var(--color-primary-300);
      transition: all .3s;
      content: '';
      flex-basis: 13px;
      width: 13px;
      height: 13px;
      border: solid 1px;
      display: inline-block;
      border-radius: 50%;
      margin: 6px 0 0 0;
      background: var(--color-secondary-400);
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
  .small {
    display: block;
    font-size: var(--text-sm);
    padding-left: 42px;
    margin: 0 0 16px 0;
    font-weight: normal;
    color: inherit;
    text-decoration: none;

    &:before {
      display: none;
    }

    + a:not(.small) {
      margin-top: 40px;
    }
  }
  .is-current {
    color: var(--color-primary-300) !important;
    &:before {
      background: var(--color-primary-300) !important;
    }
  }
`

const sidebarPosition = (
  yPosition,
  topbarInView,
  setTopbarInView,
  setTopDistance
) => {
  if (yPosition >= -60) {
    if (!topbarInView) {
      setTopbarInView(true)
    }
    setTopDistance(yPosition)
    return
  }
  setTopbarInView(false)
}

export default function TermsSidebar (props) {
  const {
    isAuthenticated = false,
    children,
    // selected,
    className
  } = props
  const [topbarInView, setTopbarInView] = useState(false)
  const [topDistance, setTopDistance] = useState(0)
  useScrollPosition(
    ({ currPos }) => sidebarPosition(
      currPos.y,
      topbarInView,
      setTopbarInView,
      setTopDistance
    )
  )

  useLayoutEffect(() => sidebarPosition(
    -window.scrollY,
    topbarInView,
    setTopbarInView,
    setTopDistance
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [])

  return (
    <div
      css={css`width:400px;`}
      className={className}
    >
      <StyledTermsSidebarWrapper
        style={{
          '--sidebarCurrentDistanceTop': `${60 + topDistance}px`
        }}
        topbarInView={topbarInView}
      >
        {
          isAuthenticated && (
            <BackToDashboardLink
              style={{ marginLeft: 0 }}
              to={dashboardLink()}
              className='back-link'
              fixedSidebarLink
            >Back to Dashboard
            </BackToDashboardLink>
          )
        }
        <StyledTermsSidebar>
          {children}
        </StyledTermsSidebar>
      </StyledTermsSidebarWrapper>
    </div>
  )
}
