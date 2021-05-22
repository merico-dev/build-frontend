import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { TextField, Typography, withStyles } from '@material-ui/core'
import styled from '@emotion/styled'

import OnboardingButtons from '@/components/OnboardingButtons'
import { StyledOnboardingText } from '@/components/OnboardingText'
import { postData } from '@/utils/fetchData'
import queryString from 'query-string'

const StyledEmailContainer = styled.div`
  width: 320px;
  margin: 60px auto 70px;
`

const StyledEmailTitle = styled.div`
  font-size: var(--text-xl);
  color: var(--color-gray-500);
  font-weight: bold;
  margin-bottom: ${({ marginBottom }) => marginBottom ?? 0}px;
`

const StyledEmailText = styled.div`
  font-size: var(--text-sm);
  margin-top: 7px;
  color: var(--color-gray-500);
`

const StyledTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fff',
      borderColor: 'var(--color-gray-400)',
      borderRadius: 'var(--radius-md)',
      marginTop: '10px'
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-400)'
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-400)'
    },
    '&:focus .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-gray-400)'
    },
  }
})(TextField)

export default function MissingEmail () {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [waitingResponse, setWaitingResponse] = useState(false)
  const [validEmail, setValidEmail] = useState(false)
  const parsed = queryString.parse(window.location.search)

  const onConfirm = async () => {
    setWaitingResponse(true)
    try {
      await postData('/sendVerificationEmail', {
        email,
        user: JSON.parse(parsed.user)
      })
      setSent(true)
      setWaitingResponse(false)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Unable to send verification email')
      setWaitingResponse(false)
    }
  }

  const onEmailChange = ({ target }) => {
    setEmail(target.value)
    setValidEmail(target.checkValidity())
  }

  return (
    <>
      {
        !sent
          ? (
            <div>
              <StyledOnboardingText>
                We can’t seem to get your email address associated with your Github account.
                Please enter it here.
              </StyledOnboardingText>
              <StyledEmailContainer>
                <StyledEmailTitle>Email</StyledEmailTitle>
                <StyledEmailText>
                  You can add repositories associated with this
                  email address in the next step.<br /><br />
                  Please note: You can’t change your email after setting up the account.<br />
                </StyledEmailText>
                <StyledTextField
                  variant='outlined'
                  value={email}
                  onChange={onEmailChange}
                  fullWidth
                  name='email'
                  type='email'
                  required
                />
              </StyledEmailContainer>
              <OnboardingButtons
                back={() => history.replace('/onboarding/')}
                confirm={() => onConfirm()}
                disabled={!validEmail || waitingResponse}
              />
            </div>
            )
          : (
            <>
              <StyledEmailTitle marginBottom='20'>
                We’ve sent a verification email to your email address.
                Please check your inbox to verify your account.
              </StyledEmailTitle>
              <Typography variant='body2'>
                Didn’t receive the email? It may take a few minutes to arrive.
                You may also check your spam or resend the email.
              </Typography>
              <OnboardingButtons
                back={() => setSent(false)}
                confirm={() => onConfirm()}
                confirmText='Resend'
                disabled={waitingResponse}
              />
            </>
            )
      }
    </>
  )
}
