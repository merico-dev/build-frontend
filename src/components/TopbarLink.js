import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

const TopbarLinkStyle = `
  color: #fff;
  font-size: var(--text-xl);
  margin-left: 40px;
  text-decoration: none;

  &:first-of-type {
    margin-left: 0;
  }
`

const StyledTopbarLink = styled(Link)(TopbarLinkStyle)
const StyledTopbarAnchor = styled.a(TopbarLinkStyle)

export default function TopbarLink (props) {
  if (props.href) {
    return <StyledTopbarAnchor {...props} />
  }

  return <StyledTopbarLink {...props} />
}
