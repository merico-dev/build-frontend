import React from 'react'
import {
  NavLink,
  useRouteMatch
} from 'react-router-dom'
// import { css, ClassNames } from '@emotion/core'
import styled from '@emotion/styled'
import { Trans } from '@lingui/macro'

const StyledMenuBlock = styled.div`
  background: #fff;
  padding: 20px 0 20px 40px;
  text-align: left;
  width: 100%;
  position: relative;

  &:first-of-type {
    margin-top: 75px;
  }

  &:before {
    content: '';
    display: none;
    width: 6px;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: var(--color-primary-400);
    border-radius: 3px;
  }

  ${({ active }) => (active && `
    background: var(--color-background);
    &:before {
      display: block;
    }
  `)}
`

const StyledNavLink = styled(NavLink)`
  transition: color .3s ease;
  display: block;
  font-size: var(--text-sm);
  line-height: var(--line-height-sm);
  color: var(--color-gray-400);
  text-decoration: none;
  margin: 20px 0 0 32px;

  &:hover {
    color: var(--color-gray-500);
  }

  ${({ styled }) => (styled?.big && `
      margin: 0;
      color: var(--color-gray-400);
      font-size: var(--text-md);
      line-height: var(--line-height-md);
      text-transform: uppercase;

      &:before {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        background: var(--color-gray-400);
        margin-right: 10px;
        border-radius: 50%;
      }
  `)}
`

export default function LegacyMenu (props) {
  const {
    activeClass
  } = props

  const isDashboard = useRouteMatch({
    path: '/dashboard',
    strict: false
  })

  const isRepositories = useRouteMatch({
    path: '/repositories',
    strict: false
  })

  const isBadges = useRouteMatch({
    path: '/badges',
    strict: false
  })

  return (
    <>
      <StyledMenuBlock active={isDashboard}>
        <StyledNavLink
          styled={{ big: true }}
          activeClassName={activeClass}
          to='/dashboard'
          exact
        >
          <Trans>Dashboard</Trans>
        </StyledNavLink>
        <StyledNavLink
          activeClassName={activeClass}
          to='/dashboard/impact'
        >
          <Trans>Impact</Trans>
        </StyledNavLink>
        <StyledNavLink
          activeClassName={activeClass}
          to='/dashboard/productivity'
        >
          <Trans>Productivity</Trans>
        </StyledNavLink>
        <StyledNavLink
          activeClassName={activeClass}
          to='/dashboard/quality'
        >
          <Trans>Quality</Trans>
        </StyledNavLink>
      </StyledMenuBlock>
      <StyledMenuBlock
        active={isRepositories}
      >
        <StyledNavLink
          activeClassName={activeClass}
          styled={{ big: true }}
          to='/repositories'
        >
          <Trans>Repositories</Trans>
        </StyledNavLink>
      </StyledMenuBlock>
      <StyledMenuBlock
        active={isBadges}
      >
        <StyledNavLink
          activeClassName={activeClass}
          styled={{ big: true }}
          to='/badges'
        >
          <Trans>Badges</Trans>
        </StyledNavLink>
      </StyledMenuBlock>
    </>
  )
}
