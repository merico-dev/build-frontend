import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'
import {
  useRouteMatch
} from 'react-router-dom'
import { mdMedia } from '@/styles/snippets/responsive'
import { ClickAwayListener } from '@material-ui/core'
import { ClassNames } from '@emotion/core'
import { CSSTransition } from 'react-transition-group'
import { useSelector } from 'react-redux'
import Menu from '@/components/Menu/Menu'
import { NextGenerationPrivateMenu, NextGenerationPublicMenu } from '@/components/Menu/Configuration'
import LegacyResponsiveMenu from '@/components/Menu/LegacyResponsiveMenu'

const StyledResponsiveSidebarContainer = styled.div`
  transition: opacity .3s, height .5s;
  padding-top: 25px;
  overflow: hidden;
  width: 190px;
  background: #FFF;
  box-shadow: var(--elevation-1);
  pointer-events: none;
  opacity: 0;
  position: absolute;
  left: 0;
  top: 100%;
  min-height: 240px;
  opacity: 1;
  pointer-events: all;

  &.display-enter {
    opacity: 0;
    height: 0;
  }
  &.display-enter-active {
    opacity: 1;
    height: 240px;
  }
  &.display-exit {
    opacity: 1;
    height: 240px;
  }
  &.display-exit-active {
    opacity: 0;
    height: 0px;
  }

  ${mdMedia(`
    display: none;
  `)}
`

const StyledHamburguerWrapper = styled.button`
  background: transparent;
  outline: 0;
  border: 0;
  display: flex;
  width: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  ${mdMedia(`
    display: none;
  `)}
`

function ResponsiveSidebarMenu (props) {
  const {
    closeSidebar,
    open,
    activeClass,
    nextGenMode = false,
    isAuthenticated = false
  } = props

  const user = useSelector((state) => state.user)
  const [nextGeneration, setNextGeneration] = useState(nextGenMode)
  const atCurrentRoute = useRouteMatch({
    path: top.location.pathname,
    strict: false
  })

  useEffect(() => {
    const nextGenLocalStorage = JSON.parse(localStorage?.getItem('CE-nextGeneration'))
    setNextGeneration(nextGenLocalStorage ?? false)
  }, [])

  return (
    <ClickAwayListener onClickAway={closeSidebar}>
      <StyledResponsiveSidebarContainer open={open}>
        {!nextGeneration
          ? (
            <>
              <LegacyResponsiveMenu user={user} activeClass={activeClass} />
            </>
            )
          : (
            <>
              <Menu
                atCurrentRoute={atCurrentRoute}
                menuConfiguration={isAuthenticated ? NextGenerationPrivateMenu : NextGenerationPublicMenu}
                responsive
              />
            </>
            )}
      </StyledResponsiveSidebarContainer>
    </ClickAwayListener>
  )
}

export default function ResponsiveSidebar ({ isAuthenticated }) {
  const [open, setOpen] = useState(false)

  const toggleSidebar = () => {
    setOpen(!open)
  }

  const closeSidebar = () => {
    setOpen(false)
  }

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
          <>
            <StyledHamburguerWrapper onClick={toggleSidebar}>
              <svg width='22' height='20' viewBox='0 0 22 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M1 1H21' stroke='white' strokeWidth='1.5' strokeLinecap='round' />
                <path d='M1 10H21' stroke='white' strokeWidth='1.5' strokeLinecap='round' />
                <path d='M1 19H21' stroke='white' strokeWidth='1.5' strokeLinecap='round' />
              </svg>
            </StyledHamburguerWrapper>
            <CSSTransition
              in={open}
              timeout={350}
              classNames='display'
              unmountOnExit
            >
              <ResponsiveSidebarMenu
                closeSidebar={closeSidebar}
                open={open}
                activeClass={activeClass}
                isAuthenticated={isAuthenticated}
              />
            </CSSTransition>
          </>
        )
      }}
    </ClassNames>
  )
}
