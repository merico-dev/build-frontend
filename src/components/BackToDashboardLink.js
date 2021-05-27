import React from 'react'
import styled from '@emotion/styled'

import { Link } from 'react-router-dom'
import { ReactComponent as BackArrow } from '@/icons/back-arrow.svg'
import {
  useTheme,
  useMediaQuery
} from '@material-ui/core'

const StyledBackLink = styled(Link)`
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  display: flex;
  align-items: center;
  color: #717484;
  text-decoration: none;
  max-width: 200px;
  margin: 22px 0 36px 20px;

  &.fixed-link {
    position: absolute;
    z-index: 100;
    top: 4px;
    left: 50px;
    color: #ffffff;

    svg:first-of-type path {
      fill: #ffffff;
    }
  }

  svg:first-of-type {
    margin-right: 12px;
  }
`

export default function BackToDashboardLink (props) {
  const {
    to,
    fixedSidebarLink = false,
    onClick = () => {},
    children
  } = props
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const linkStyles = { marginLeft: isMdUp ? '50px' : '20px', ...props.style }

  return (
    <StyledBackLink to={to} onClick={onClick} style={linkStyles} className={fixedSidebarLink ? 'fixed-link' : ''}>
      <BackArrow width='16' height='16' />
      {children}
    </StyledBackLink>
  )
}
