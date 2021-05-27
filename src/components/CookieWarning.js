import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Typography, makeStyles, useTheme, useMediaQuery } from '@material-ui/core'
import styled from '@emotion/styled'

import { ReactComponent as Times } from '@/icons/times.svg'

const StyledCookieWarning = styled.div`
  transition: opacity .3s, transform .3s;
  position: fixed;
  background: var(--color-background-600);
  padding: 16px 20px;
  display: flex;
  right: 0;
  bottom: 0;
  max-width: 485px;
  width: 100%;
  z-index: 8;
  gap: 20px;

  &.is-hidden {
    opacity: 0;
    transform: translateY(100%);
    pointer-events: none;
  }
`

const StyledTimes = styled(Times)`
  margin-left: auto;
  cursor: pointer;
  color: var(--color-gray-500);
  position:absolute;
  right: 20px;
  top: 12px;
`

const StyledLink = styled(Link)`
  color: inherit;
`

const StyledCookieText = styled.div`
  align-items: center;
  flex-wrap: wrap;
`

const useStyles = makeStyles((theme) => ({
  h2: {
    margin: 0,
    fontSize: 'var(--text-lg)',
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 'auto',
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: 'var(--text-xl)',
    }
  },
  body1: {
    color: 'var(--color-gray-500)',
    fontSize: 'var(--text-xs)',
  },
  button: {
    margin: '10px 0 0',
    minWidth: 0,
    height: '32px',
    width: '84px',
    backgroundColor: 'var(--color-gray-400)',
    boxShadow: 'var(--elevation-1)',
    fontSize: 'var(--text-md)',
    '&:hover': {
      boxShadow: '0px 2px 7px rgba(0, 0, 0, 0.41)',
      backgroundColor: 'var(--color-gray-400)'
    },
    [theme.breakpoints.down('xs')]: {
      margin: '20px 0 0 auto',
    },
  }
}))

export default function CookieWarning () {
  const [isCookieWarningVisible, setIsCookieWarningVisible] = useState(true)
  const [shouldCookieWarningRender, setShouldCookieWarningRender] = useState(false)
  const classes = useStyles()
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

  useEffect(() => {
    if (Number(window.localStorage.getItem('cookie')) !== 1) {
      setShouldCookieWarningRender(true)
    }
  }, [])
  const onClose = () => {
    setIsCookieWarningVisible(false)
  }
  const onAccept = () => {
    window.localStorage.setItem('cookie', 1)
    setIsCookieWarningVisible(false)
  }

  if (!shouldCookieWarningRender) return null

  return (
    <StyledCookieWarning className={isCookieWarningVisible ? '' : 'is-hidden'}>
      <StyledCookieText>
        <Typography variant='h2' className={classes.h2}>This website uses cookies</Typography>
        <Typography variant='body1' className={classes.body1}>
          By using this website, you accept our <StyledLink to='/privacy'>privacy policy</StyledLink>.
        </Typography>
      </StyledCookieText>
      <Button
        color='secondary'
        onClick={onAccept}
        variant='contained'
        size={isMdUp ? 'medium' : 'small'}
        data-test='cookie-accept'
        className={classes.button}
      >
        Accept
      </Button>
      <StyledTimes width='13' height='13' onClick={onClose} />
    </StyledCookieWarning>
  )
}
