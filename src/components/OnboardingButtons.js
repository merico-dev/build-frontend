import React from 'react'
import { Button, makeStyles } from '@material-ui/core'
import styled from '@emotion/styled'
import { smMedia } from '@/styles/snippets/responsive'

const StyledOnboardingButtons = styled.div`
  display: flex;
  width: 100%;
  padding-top: 15px;
  margin-top: 0;
  flex-wrap: wrap;
  // gap: 10px; // NOTE: Safari & IE do not currently support gap
  justify-content: space-around;
  ${({ hasBack }) => !hasBack && 'justify-content: center;'}
  ${smMedia(`
    margin-top: auto;
    justify-content: space-between;
  `)}
`

const useStyles = makeStyles((theme) => ({
  button: {
    // marginLeft: 'auto',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0'
    }
  },
  firstButton: {
    marginLeft: 'auto',
    marginRight: '10px'
  }
}))

export default function OnboardingButtons (props) {
  const {
    back,
    confirm,
    backDisabled = false,
    disabled = false,
    confirmText = 'Confirm',
    confirmType = 'button',
    backText = 'Back'
  } = props
  const classes = useStyles()

  let backProps = {}
  if (typeof back === 'function') {
    backProps = { onClick: back }
  }

  return (
    <StyledOnboardingButtons hasBack={back}>
      {
        back && (
          <Button
            variant={backDisabled ? 'contained' : 'outlined'}
            color='primary'
            disabled={backDisabled}
            className={classes.firstButton}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...backProps}
          >
            {backText}
          </Button>
        )
      }
      {
        confirm && (
          <Button
            onClick={confirm}
            variant='contained'
            color='primary'
            disabled={disabled}
            id='OnboardingConfirmButton'
            type={confirmType}
            className={back ? classes.button : classes.firstButton}
          >
            {confirmText}
          </Button>
        )
      }
    </StyledOnboardingButtons>
  )
}
