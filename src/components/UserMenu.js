import React, { useState, useRef } from 'react'
import styled from '@emotion/styled'
import { Link, useRouteMatch } from 'react-router-dom'

import {
  IconButton,
  MenuItem,
  withStyles,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList
} from '@material-ui/core'
import { Trans, t } from '@lingui/macro'
import { useI18n } from '@/utils/i18n'

import Avatar from '@/components/Avatar/Avatar'
import { useSelector } from 'react-redux'
import { SUCCEED, LOGGED_OUT } from '@/store/statusTypes'
import TopbarLink from '@/components/TopbarLink'

const StyledMenu = withStyles({
  // paper: {
  root: {
    textAlign: 'center',
    width: '90px',
    border: '2px solid var(--color-gray-300)',
    background: '#fff',
    borderRadius: '6px',
    padding: 0
  }
})(MenuList)

const StyledMenuItem = withStyles({
  root: {
    padding: 0
  }
})(MenuItem)

const StyledMenuLink = styled(Link)`
  display: block;
  width: 100%;
  text-align: center;
  padding: 7px;
  text-decoration: none;
  color: var(--color-gray-400);
  font-size: 1.125rem;

  &:hover {
    color: var(--color-gray-600);
  }
`

export default function UserMenu () {
  const i18n = useI18n()
  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)
  const user = useSelector((state) => state.user)
  const atSignedOut = useRouteMatch('/account/signed-out')

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }
  function handleListKeyDown (event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  // Do not render user menu if the user is not successfully logged
  if (user.status !== SUCCEED && !atSignedOut) {
    return <TopbarLink to='/login'>Log in</TopbarLink>
  }
  // Show NO LINK if Just Logged Out
  if (user.status === LOGGED_OUT && atSignedOut) {
    return null
  }

  return (
    <>
      <IconButton
        aria-controls={open ? 'menu-list-grow' : undefined}
        ref={anchorRef}
        onClick={handleToggle}
        aria-haspopup='true'
        aria-label='Toggle user menu'
      >
        <Avatar
          title={i18n._(t`User Avatar`)}
          iconSize={16}
          url={user?.data?.photo}
        />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement='bottom-end'
        role={undefined}
        transition
        style={{ zIndex: 5 }}
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <div>
              <ClickAwayListener onClickAway={handleClose}>
                <StyledMenu
                  autoFocusItem={open}
                  id='menu-list-grow'
                  onKeyDown={handleListKeyDown}
                >
                  <StyledMenuItem onClick={handleClose}>
                    <StyledMenuLink to='/account'>
                      <Trans>Settings</Trans>
                    </StyledMenuLink>
                  </StyledMenuItem>
                  <StyledMenuItem onClick={handleClose}>
                    <StyledMenuLink to='/account/signed-out'>
                      <Trans>Sign Out</Trans>
                    </StyledMenuLink>
                  </StyledMenuItem>
                </StyledMenu>
              </ClickAwayListener>
            </div>
          </Grow>
        )}
      </Popper>
    </>
  )
}
