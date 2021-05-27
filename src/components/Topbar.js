import React from 'react'
import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import {
  useMediaQuery,
  useTheme,
  Tooltip,
  makeStyles,
  Button
} from '@material-ui/core'

import { mdMedia } from '@/styles/snippets/responsive'
import { ReactComponent as Logo } from '@/images/logo.svg'
import { ReactComponent as ContactEnvelope } from '@/icons/contact-envelope.svg'
import UserMenu from '@/components/UserMenu'
// import Notifications from '@/components/Notifications';
import UserNotification from '@/components/UserNotification'
import ResponsiveSidebar from '@/components/ResponsiveSidebar'
import TopbarLink from '@/components/TopbarLink'

const StyledHeader = styled.header`
  height: 60px;
  background: var(--color-gray-500);
  display: flex;
  padding: 0 20px 0 0;
  align-items: center;
  justify-content: ${({ showLogo }) => (showLogo ? 'space-between' : 'flex-end')};
  position: fixed;
  width: 100%;
  z-index: 7;
  top: 0;

  ${mdMedia(`
    padding: 0 50px;
  `)}
`

const StyledLogoWrapper = styled.div`
  display: flex;
  margin: auto;

  ${({ showLogo }) => mdMedia(showLogo
    ? 'margin: 0;'
    : 'display: none;'
  )}
`

const StyledUserFeatures = styled.div`
  display: flex;
  vertical-align: middle;
  align-items: center;
  color: #fff;
`

const StyledContactLink = styled(Link)`
  margin-right: 27px;
  color: #fff;
  text-decoration: none;
`

const useStyles = makeStyles({
  tooltip: {
    border: 'none',
    padding: '3px 5px 4px',
    borderRadius: 'var(--radius-xs)',
    color: 'var(--color-gray-400)',
    background: '#fff',
    margin: '5px 0 0 0',
    boxShadow: 'var(--elevation-1)',
    fontSize: 'var(--text-xs)'
  },
  signUp: {
    width: '140px',
    marginLeft: '40px'
  }
})

export default function Topbar (props) {
  const {
    showLogo,
    fixed,
    isAuthenticated = false
  } = props

  const classes = useStyles()
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <StyledHeader showLogo={showLogo} fixed={fixed}>
      <ResponsiveSidebar isAuthenticated={isAuthenticated} />
      <StyledLogoWrapper showLogo={showLogo}>
        <Link to='/dashboard/overview' aria-label='Home page'>
          <Logo height='29' aria-label='Merico Logo' />
        </Link>
      </StyledLogoWrapper>
      <StyledUserFeatures data-test='styled-user-features'>
        {
          !isAuthenticated && isMdUp && (
            <>
              <TopbarLink data-test='topbar-link-about' to='/team'>About</TopbarLink>
              <TopbarLink data-test='topbar-link-contact' to='/contact'>Contact</TopbarLink>
              <TopbarLink data-test='topbar-link-help' to='/help'>Documentation</TopbarLink>
              <TopbarLink
                data-test='topbar-link-github'
                href='https://github.com/merico-dev/community/discussions'
                target='_blank'
              >
                GitHub
              </TopbarLink>
            </>
          )
        }
        {
          !isAuthenticated && (
            <Button
              data-test='topbar-button-signup'
              color='primary'
              variant='contained'
              component={Link}
              to='/'
              size='small'
              className={classes.signUp}
            >
              Sign up
            </Button>
          )
        }
        {
          isAuthenticated && (
            <>
              <Tooltip
                title='Contact Us'
                placement='bottom'
                classes={{ tooltip: classes.tooltip }}
              >
                <StyledContactLink to='/contact'>
                  <ContactEnvelope
                    width='16'
                    height='18'
                  />
                </StyledContactLink>
              </Tooltip>
              <UserNotification />
              <UserMenu />
            </>
          )
        }
      </StyledUserFeatures>
    </StyledHeader>
  )
}
