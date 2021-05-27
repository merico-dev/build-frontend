import React from 'react'
import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'
import { SUCCEED } from '@/store/statusTypes'
import { Trans } from '@lingui/macro'

const StyledNavLink = styled(NavLink)`
  transition: color .3s ease;
  display: block;
  font-size: var(--text-xs);
  line-height: 1;
  color: var(--color-gray-400);
  text-decoration: none;
  margin: 0 0 20px 30px;

  &:hover {
    color: var(--color-gray-500);
  }

  ${({ styled }) => (styled?.big && `
      color: var(--color-gray-400);
      font-size: var(--text-sm);
      line-height: 1;
      text-transform: uppercase;
      margin-left: 20px;
  `)}
`

export default function LegacyResponsiveMenu (props) {
  const {
    user,
    activeClass
  } = props

  return (
    <>
      {user.status === SUCCEED
        ? (
          <>
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
              to='/dashboard/quality'
            >
              <Trans>Quality</Trans>
            </StyledNavLink>
            <StyledNavLink
              activeClassName={activeClass}
              to='/dashboard/productivity'
            >
              <Trans>Productivity</Trans>
            </StyledNavLink>
            <StyledNavLink
              activeClassName={activeClass}
              to='/dashboard/impact'
            >
              <Trans>Impact</Trans>
            </StyledNavLink>
            <StyledNavLink
              activeClassName={activeClass}
              styled={{ big: true }}
              to='/repositories'
            >
              <Trans>Repositories</Trans>
            </StyledNavLink>
            <StyledNavLink
              activeClassName={activeClass}
              styled={{ big: true }}
              to='/badges'
            >
              <Trans>Badges</Trans>
            </StyledNavLink>
          </>
          )
        : (
          <>
            <StyledNavLink
              activeClassName={activeClass}
              styled={{ big: true }}
              to='/team'
            >
              <Trans>About</Trans>
            </StyledNavLink>
            <StyledNavLink
              activeClassName={activeClass}
              styled={{ big: true }}
              to='/help'
            >
              <Trans>Help</Trans>
            </StyledNavLink>
            <StyledNavLink
              activeClassName={activeClass}
              styled={{ big: true }}
              to='/contact'
            >
              <Trans>Contact</Trans>
            </StyledNavLink>
          </>
          )}
    </>
  )
}
