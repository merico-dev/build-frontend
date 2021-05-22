
import React, { useState, useEffect } from 'react'
import {
  NavLink,
} from 'react-router-dom'
import styled from '@emotion/styled'
import Badge from '@material-ui/core/Badge'

const StyledMenu = styled.div`
  padding: 0;
  margin: 0;
  width: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`

const StyledMenuItem = styled.div`
  background: #fff;
  text-align: left;
  width: 100%;
  position: relative;
  outline: none!important;

  &:first-of-type {
    ${({ responsive }) => (!responsive && `
      margin-top: 75px;
    `)}
  }

  ${({ active }) => (active === 'true' && `
    background: #FFF3EB;
    &:before {
      display: block;
    }
  `)}
`

const StyledNavItem = styled(NavLink)`
  display: flex;
  flex-direction: row;
  height: 44px;
  line-height: 44px;
  ${({ responsive }) => (!responsive && `
    font-size: var(--text-xs);
    text-transform: uppercase;
  `)}
  padding: 0 20px 0 20px;
  text-decoration: none;
  outline: none !important;
  color: var(--color-gray-500);
  transition: all 0.4s ease;

  &:hover {
    color: var(--color-brand-400);

    ${({ active }) => (active === 'true' && `
      color: var(--color-brand-400);
    `)}

    > div > svg path {
      fill: var(--color-brand-400);
      ${({ active }) => (active === 'true' && `
        fill: var(--color-brand-400);
      `)}
    }
  }

  ${({ active }) => (active === 'true' && `
    background-color: #FFF3EB;
    color: var(--color-brand-500);
    font-weight: bold;

    > div > svg path {
      fill: var(--color-brand-500) !important
    }
  `)}

  ${({ routeable }) => (routeable === 'no' && `
    pointer-events: none;
    color: var(--color-gray-400);
    opacity: 0.9;

    > div > svg path {
      fill: var(--color-gray-300)
    }
  `)}

  > div > svg {
    margin-right: 10px;
    display: inline-block;
    line-height: 44px;
    max-width: 100%;
    align-self: center;
    transform: scale(0.85);
  }
  > div > svg path {
    fill: var(--color-gray-400)
  }
`

const StyledMenuLink = styled(NavLink)`
  transition: color .3s ease;
  display: flex;
  position: relative;
  flex-direction: row;
  justify-content: left;
  height: 44px;
  line-height: 44px;
  padding: 0 20px 0 32px;
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  text-decoration: none;

  &:hover {
    color: var(--color-brand-400);

    > div > svg path {
      fill: var(--color-brand-400);
    }
  }

  ${({ active }) => (active === 'true' && `
    color: var(--color-brand-500);
    font-weight: bold;
    background-color: #FFF3EB;

    > div > svg path {
      fill: var(--color-brand-500) !important
    }
  `)}

  ${({ routeable }) => (routeable === 'no' && `
    pointer-events: none;
    color: var(--color-gray-300);

    > div > svg path {
      fill: var(--color-gray-300) !important;
    }
  `)}

  > div > svg {
    margin-right: 10px;
    display: inline-block;
    line-height: 44px;
    max-width: 100%;
    align-self: center;
    transform: scale(0.85);
  }
  > div > svg path {
    fill: var(--color-gray-400);
  }
`

const StyledNavLabel = styled.span`
  overflow: hidden;
  width: 94%;
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const StyledNavIcon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ hasIcon }) => (hasIcon && `
    width: 24px;
  `)}
`

export default function Menu (props) {
  const {
    atCurrentRoute,
    menuConfiguration = [],
    useDotBadges = false,
    maxBadgeCount = 999,
    responsive = false,
    defaultNavigation = {
      name: 'overview',
      label: 'Overview',
      to: '/dashboard',
      exactMatch: false,
      activeClass: null,
      isActive: false,
      icon: null,
      disabled: false,
      badgeContent: null,
      children: [],
    }
  } = props

  const [navigationItems, setNavigationItems] = useState([])
  const [activeNavigation, setActiveNavigation] = useState(defaultNavigation)

  const isRouteExactMatch = (routePath, itemPath) => {
    return routePath === itemPath
  }

  const isRouteFuzzyMatch = (routePath, itemPath) => {
    return routePath.includes(itemPath)
  }

  useEffect(() => {
    const createMenuChildren = (items) => {
      return items.map((child, idx) => {
        if (child.href) {
          return (
            <a
              key={`menu-item-link--${idx}`}
              href={child.href}
              target={child.target || 'blank'}
            >
              {!responsive && (<StyledNavIcon hasIcon={child.icon !== null}>{child.icon}</StyledNavIcon>)}
              <StyledNavLabel>
                {child.label}
                {child.badgeContent &&
                  (
                    <Badge
                      style={{ position: 'absolute', top: '22px', right: '20px', transform: 'scale(0.85)' }}
                      badgeContent={child.badgeContent}
                      variant={useDotBadges ? 'dot' : ''}
                      max={maxBadgeCount}
                      color='primary'
                    />
                  )}
              </StyledNavLabel>
            </a>
          )
        }
        return (
          <StyledMenuLink
            key={`menu-item-link--${idx}`}
            active={child.isActive.toString()}
            activeClassName={child.activeClass ?? 'active-navigation'}
            routeable={child.to !== null ? 'yes' : 'no'}
            to={child.to ?? '#'}
            exact
          >
            {!responsive && (<StyledNavIcon hasIcon={child.icon !== null}>{child.icon}</StyledNavIcon>)}
            <StyledNavLabel>
              {child.label}
              {child.badgeContent &&
                (
                  <Badge
                    style={{ position: 'absolute', top: '22px', right: '20px', transform: 'scale(0.85)' }}
                    badgeContent={child.badgeContent}
                    variant={useDotBadges ? 'dot' : ''}
                    max={maxBadgeCount}
                    color='primary'
                  />
                )}
            </StyledNavLabel>
          </StyledMenuLink>
        )
      })
    }

    const createMenuItems = (items) => {
      return items.map((item, idx) => {
        return (
          <StyledMenuItem responsive={responsive} key={`menu-item--${idx}`}>
            <StyledNavItem
              active={item.isActive.toString()}
              activeClassName={item.activeClass ?? 'active-navigation'}
              routeable={item.to !== null ? 'yes' : 'no'}
              to={item.to ?? '#'}
            >
              {!responsive && (<StyledNavIcon hasIcon={item.icon !== null}>{item.icon}</StyledNavIcon>)}
              <StyledNavLabel>
                {item.label}
                {item.badgeContent &&
                (
                  <Badge
                    style={{ position: 'absolute', top: '22px', right: '20px', transform: 'scale(0.85)' }}
                    badgeContent={item.badgeContent}
                    variant={useDotBadges ? 'dot' : ''}
                    max={maxBadgeCount}
                    color='primary'
                  />
                )}
              </StyledNavLabel>
            </StyledNavItem>
            {createMenuChildren(item.children)}
          </StyledMenuItem>
        )
      })
    }

    const menu = menuConfiguration.map((item) => {
      const isRouteMatched = item.exactMatch
        ? isRouteExactMatch(atCurrentRoute?.path, item.to)
        : isRouteFuzzyMatch(atCurrentRoute?.path, item.to)
      const children = item.children.map((child) => {
        const isChildRouteMatched = child.exactMatch
          ? isRouteExactMatch(atCurrentRoute?.path, child.to)
          : isRouteFuzzyMatch(atCurrentRoute?.path, child.to)
        return { ...child, isActive: atCurrentRoute !== null && isChildRouteMatched }
      })
      return { ...item, children, isActive: atCurrentRoute !== null && isRouteMatched }
    })

    setNavigationItems(createMenuItems(menu))
  }, [atCurrentRoute, menuConfiguration, maxBadgeCount, useDotBadges, responsive])

  useEffect(() => {
    const routeMatched = navigationItems.some((item) => item.isActive)
    setActiveNavigation(routeMatched ?? defaultNavigation)
  }, [navigationItems, defaultNavigation])

  return (
    <StyledMenu responsive={responsive} activeNavigation={activeNavigation}>
      {navigationItems}
    </StyledMenu>
  )
}
