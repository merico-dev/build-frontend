import React from 'react'
import styled from '@emotion/styled'
import Avatar from '@/components/Avatar/Avatar'
import { Typography, withStyles, useTheme, useMediaQuery } from '@material-ui/core'
import { Link } from 'react-router-dom'

import { lgMedia, smMedia } from '@/styles/snippets/responsive'
import { ReactComponent as Email } from '@/icons/email.svg'
import { ReactComponent as Github } from '@/icons/github.svg'
import { ReactComponent as Gitlab } from '@/icons/gitlab.svg'

const StyledDeveloperCard = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 18px;
  background: #fff;
  border-radius: var(--radius-md);
  box-shadow: var(--elevation-1);

  ${smMedia(`
    background: transparent;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
  `)}

  ${lgMedia(`
    flex-direction: column;
  `)}
`

const StyledAvatar = styled(Avatar)`
  margin: 0 50px 0 0;
  ${lgMedia(`
    margin: 0 auto;
  `)}
`

const StyledProfileLinkWrapper = styled.div`
  text-align: left;

  ${lgMedia(`
    text-align: center;
  `)}
`

const StyledLink = styled(Link)`
  color: var(--color-primary-400);
  font-size: var(--text-xs);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const StyledTypography = withStyles((theme) => ({
  h1: {
    margin: '0 auto',
    fontSize: 'var(--text-xl)',
    textAlign: 'left',
    [theme.breakpoints.up('lg')]: {
      margin: '48px auto 0',
      textAlign: 'center'
    }
  },
  body2: {
    display: 'flex',
    alignItems: 'top',
    color: 'var(--color-gray-400)',
    marginBottom: '14px',
    padding: '0 31px 0 0',
    '&:last-of-type': {
      marginBottom: 0
    },
    [theme.breakpoints.up('lg')]: {
      padding: '0 0 0 31px',
      alignItems: 'center',
    }
  }
}))(Typography)

const StyledServiceName = styled.div`
  display: none;
  margin-left: 12px;

  ${lgMedia(`
    display: block;
  `)}
`

const StyledSocialContainer = styled.div`
  display: flex;
  margin-top: 16px;
  ${lgMedia(`
    margin-top: 43px;
    display: block;
  `)}
`

export default function DeveloperCard (props) {
  const {
    userData,
    showProfileLink
  } = props
  const theme = useTheme()
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <StyledDeveloperCard data-test='developer-card'>
      <StyledAvatar
        size={isLgUp ? '120px' : '66px'}
        iconSize={isLgUp ? '39' : '23'}
        color='primary'
        url={userData?.photo}
      />
      <div>
        <StyledTypography variant='h1' align='center'>{userData?.displayName}</StyledTypography>
        {
          showProfileLink &&
            (
              <StyledProfileLinkWrapper>
                <StyledLink to={`/profile/${userData?.id}`}>
                  View Public Profile
                </StyledLink>
              </StyledProfileLinkWrapper>
            )
        }
        <StyledSocialContainer>
          {
            (userData?.githubUsername)
              ? (
                <StyledTypography variant='body2' component='div'>
                  <Github width='19' height='18' />
                  <StyledServiceName>{userData?.githubUsername}</StyledServiceName>
                </StyledTypography>
                )
              : null
          }
          {
            (userData?.gitlabUsername)
              ? (
                <StyledTypography variant='body2' component='div'>
                  <Gitlab width='19' height='18' />
                  <StyledServiceName>{userData?.gitlabUsername}</StyledServiceName>
                </StyledTypography>
                )
              : null
          }
          <StyledTypography variant='body2' component='div'>
            <Email width='19' height='15' />
            <StyledServiceName>{userData?.primaryEmail}</StyledServiceName>
          </StyledTypography>
          {/* <StyledTypography variant="body2" component="div">
            <LinkIcon width="16" height="16" />
            <StyledServiceName>developer-a.com</StyledServiceName>
          </StyledTypography> */}
        </StyledSocialContainer>
      </div>
    </StyledDeveloperCard>
  )
}
