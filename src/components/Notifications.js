import React, { useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { Card, makeStyles } from '@material-ui/core'
import { CSSTransition } from 'react-transition-group'

import Medal from '@/images/medal.png'
import { ReactComponent as Bell } from '@/icons/bell.svg'
import { ReactComponent as Times } from '@/icons/times.svg'

const StyledBell = styled(Bell)`
  color: var(--color-background-600);
  cursor: pointer;
`

const StyledNotification = styled.div`
  position: relative;
  height: 100%;
  width: 39px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const useStyles = makeStyles({
  card: {
    padding: '16px',
    position: 'absolute',
    top: '76px',
    right: '-44px',
    maxWidth: '459px',
    width: '90vw',
    display: 'grid',
    gridTemplateColumns: '38px 1fr',
    gap: '12px',
    color: 'var(--color-gray-400)'
  },
  link: {
    color: 'var(--color-primary-400)',
    display: 'inline-block',
    marginTop: '5px',
    borderBottom: '1px solid',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
    }
  }
})

const StyledCardContainer = styled.div`
  transition: opacity .3s;
  opacity: 1;

  &.display-enter {
    opacity: 0;
  }
  &.display-enter-active {
    opacity: 1;
  }
  &.display-exit {
    opacity: 1;
  }
  &.display-exit-active {
    opacity: 0;
  }
`

const StyledTimes = styled(Times)`
  position: absolute;
  right: 0;
  top: 0;
  margin: 11px;
  cursor: pointer;
`

export default function Notifications () {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const handleToggle = () => {
    setOpen((open) => !open)
  }

  return (
    <StyledNotification>
      <Link to='/badges/'>
        <StyledBell
          width='15.75'
          height='20.62'
        />
      </Link>
      <CSSTransition
        in={open}
        timeout={350}
        classNames='display'
        unmountOnExit
      >
        <StyledCardContainer>
          <Card className={classes.card}>
            <StyledTimes
              onClick={handleToggle}
              width={11}
              height={11}
            />
            <img src={Medal} alt='Medal' />
            <div>
              Congratulations! You have earned a new badge!<br />
              <Link
                to='/badges/assert/1'
                className={classes.link}
              >Learn more
              </Link>
            </div>
          </Card>
        </StyledCardContainer>
      </CSSTransition>
    </StyledNotification>
  )
}
