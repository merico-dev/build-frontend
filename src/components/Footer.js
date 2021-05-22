import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Trans } from '@lingui/macro'
import { Link } from 'react-router-dom'
import { smMedia } from '@/styles/snippets/responsive'

const StyledFooter = styled.footer`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  font-size: var(--text-xs);
  color: var(--color-gray-400);
  padding: 30px 0;

  ${smMedia(css`
    align-items: center;
    justify-content: center;
    flex-direction: row;
  `)}
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: var(--color-gray-400);
  margin: 15px 0 0;

  &:hover {
    color: var(--color-gray-600);
  }

  ${smMedia(css`
    margin: 0 0 0 42px;
  `)}
`

const year = new Date().getFullYear()

export default function Footer (props) {
  const { isOpenPage } = props

  return (
    <StyledFooter>
      <span>&#169; {year} Merico</span>
      <StyledLink to='/terms'>
        <Trans>Terms</Trans>
      </StyledLink>
      <StyledLink to='/privacy'>
        <Trans>Privacy</Trans>
      </StyledLink>
      <StyledLink to='/team'>
        <Trans>About</Trans>
      </StyledLink>
      {
        !isOpenPage && (
          <StyledLink to='/help'>
            <Trans>Help</Trans>
          </StyledLink>
        )
      }
      <StyledLink to='/contact'>
        <Trans>Contact Us</Trans>
      </StyledLink>
    </StyledFooter>
  )
}
