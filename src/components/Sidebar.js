import React, { useState, useEffect } from 'react'
import {
  Link, useRouteMatch
} from 'react-router-dom'
import { css, ClassNames } from '@emotion/core'
import styled from '@emotion/styled'
import { ReactComponent as Logo } from '@/images/logo.svg'
import { mdMedia } from '@/styles/snippets/responsive'

import Menu from '@/components/Menu/Menu'
import LegacyMenu from '@/components/Menu/LegacyMenu'
import { NextGenerationPrivateMenu } from '@/components/Menu/Configuration'
// import Switch from '@material-ui/core/Switch'

const StyledSidebar = styled.div`
  background-color: var(--color-sidebar);
  overflow: auto;
  box-shadow: var(--elevation-1);
  width: 220px;
  position: relative;
  display: none;
  ${mdMedia(css`
    display: block;
  `)}
`

const StyledSidebarContent = styled.nav`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-basis: 100%;
  justify-content: flex-start;
  align-items: center;
  position: fixed;
  padding-top: 35px;
  top: 0;
  width: 220px;
  overflow-y: auto;
  height: 100vh;
`

export default function Sidebar () {
  const [nextGeneration, setNextGeneration] = useState(true)

  const atCurrentRoute = useRouteMatch({
    path: top.location.pathname,
    strict: false
  })

  // const toggleNextGenMode = () => {
  //   localStorage?.setItem('CE-nextGeneration', !nextGeneration)
  //   setNextGeneration(!nextGeneration)
  // }

  const DashboardLinkUrl = nextGeneration ? '/dashboard/overview' : '/dashboard'

  useEffect(() => {
    // #997 Enforce "NextGen" Mode by DEFAULT
    const oldGenLocalStorage = JSON.parse(localStorage?.getItem('CE-oldGeneration'))
    localStorage?.setItem('CE-nextGeneration', !oldGenLocalStorage ?? false)
    const nextGenLocalStorage = JSON.parse(localStorage?.getItem('CE-nextGeneration'))
    setNextGeneration((nextGenLocalStorage && !oldGenLocalStorage) ?? false)
  }, [])

  return (
    <ClassNames>
      {({ css }) => {
        const activeClass = css`
          color: var(--color-primary-400) !important;
          &:before {
            background-color: var(--color-primary-400) !important;
          }
        `
        return (
          <StyledSidebar>
            <StyledSidebarContent>
              <Link to={DashboardLinkUrl} aria-label='Home page'>
                <Logo height='48' aria-label='Merico Logo' />
              </Link>
              {nextGeneration && <Menu atCurrentRoute={atCurrentRoute} menuConfiguration={NextGenerationPrivateMenu} />}
              {!nextGeneration && <LegacyMenu activeClass={activeClass} />}
              {/* <div style={{
                alignSelf: 'flex-end',
                marginTop: 'auto',
                paddingRight: '10px',
                paddingBottom: '10px',
                lineHeight: '32px',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '14px',
                color: '#777777'
              }}
              >
                <span style={{ fontWeight: 'bold' }}>
                  WIP &nbsp;
                  <small style={{ fontWeight: 'normal', fontSize: '10px', opacity: 0.4 }}>( Work In Progress )</small>&middot;
                </span>
                <Switch
                  checked={nextGeneration}
                  onChange={toggleNextGenMode}
                  color='primary'
                  name='legacyMenu'
                  inputProps={{ 'aria-label': 'primary checkbox' }}
                />
              </div> */}
            </StyledSidebarContent>
          </StyledSidebar>
        )
      }}
    </ClassNames>
  )
}
