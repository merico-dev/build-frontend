import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { DialogTitle, Dialog, makeStyles, Typography } from '@material-ui/core'
import styled from '@emotion/styled'

import useAddField from '@/utils/useAddField'
import OnboardingButtons from '@/components/OnboardingButtons'
import { StyledOnboardingText } from '@/components/OnboardingText'
import MultipleEmails from '@/components/MultipleEmail'
import { postData } from '@/utils/fetchData'

import { MP, OnboardingEvents } from '@/utils/mixpanel'
import ModalClose from '@/components/ModalClose'
import RepositoryStatusMessage from '@/components/AddRepository/RepositoryStatusMessage'
import RepositoryStatusTitle from '@/components/AddRepository/RepositoryStatusTitle'
import RepositoryProcessConfirm from '@/components/AddRepository/RepositoryProcessConfirm'
import { FETCH_USER } from '@/store/reducers/user'
import { useDispatch } from 'react-redux'
import { DEMO_EMAIL } from '@/enums/repositories'

const useStyles = makeStyles((theme) => ({
  text: {
    margin: '20px 0 30px',
    color: 'var(--color-gray-500)'
  },
  failureTitle: {
    marginTop: 0,
    [theme.breakpoints.down('xs')]: {
      fontSize: 'var(--text-xl)',
      textAlign: 'left'
    }
  },
  demoWarning: {
    margin: '8px 0',
    color: 'var(--color-gray-500)'
  }
}))

const StyledDialogWrapper = styled.div`
  margin: 0 auto;
  ${({ limitWidth }) => (
    limitWidth
      ? 'max-width: 660px;'
      : 'padding-bottom: 20px;'
  )}
`

const StyledForm = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
`

function appendDemoEmail (serviceEmails = [], emails = []) {
  if (serviceEmails.includes(DEMO_EMAIL)) {
    return emails
  }

  return [
    ...emails,
    DEMO_EMAIL
  ]
}

function FailedRepositories (props) {
  const {
    classes,
    locationState,
    hasFailures
  } = props
  const [failuresModalOpen, setFailuresModalOpen] = useState(false)

  useEffect(() => {
    setFailuresModalOpen(hasFailures)
  }, [hasFailures])

  const handleFailureClose = () => {
    setFailuresModalOpen(false)
  }

  return (
    <Dialog
      open={failuresModalOpen}
      onClose={handleFailureClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='md'
      fullWidth
    >
      <ModalClose onClick={handleFailureClose} />
      <StyledDialogWrapper>
        <>
          <DialogTitle
            id='alert-dialog-title'
            disableTypography
          >
            <Typography
              variant='h2'
              align='center'
              className={classes.failureTitle}
            >
              <RepositoryStatusTitle response={locationState} />
            </Typography>
          </DialogTitle>
          <RepositoryStatusMessage response={locationState} />
          <RepositoryProcessConfirm
            addRepositoriesReponse
            handleClose={handleFailureClose}
          />
        </>
      </StyledDialogWrapper>
    </Dialog>
  )
}

export default function SecondaryEmails (props) {
  const { user } = props
  const history = useHistory()
  const classes = useStyles()
  const dispatch = useDispatch()
  const {
    state: locationState
  } = useLocation()
  const [hasFailures, setHasFailures] = useState(false)
  const [emails, setEmails] = useState([''])
  const [saving, setSaving] = useState(false)
  const [serviceEmails, setServiceEmails] = useState([])
  useEffect(() => {
    if (!user?.data?.UserEmails) {
      return
    }

    setServiceEmails(user.data.UserEmails.map((UserEmail) => UserEmail.email))
  }, [user, setServiceEmails])

  const {
    addEmptyEmail,
    handleEmailChange
  } = useAddField({ setEmails })
  useEffect(() => {
    if (locationState?.failures?.length) {
      setHasFailures(true)
    }
  }, [locationState, setHasFailures])

  const saveChanges = async (emails) => {
    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('emails', JSON.stringify(emails))

      await postData('/account', formData, { 'content-type': 'multipart/form-data' })
      setSaving(false)
    } catch (e) {
      setSaving(false)
    }
  }

  const confirmEmails = async (e) => {
    e.preventDefault()
    const filteredEmails = appendDemoEmail(
      serviceEmails,
      emails.filter((email) => email.length > 0)
    )
    if (filteredEmails.length > 0) {
      MP.track(OnboardingEvents.ADD_EMAILS, {
        'Secondary E-mails': filteredEmails,
        'Secondary E-mail Count': filteredEmails.length
      })
      await saveChanges(filteredEmails)
    }

    MP.track(OnboardingEvents.START_PROCESSING, {}, { send_immediately: true })
    dispatch({
      type: FETCH_USER,
      payload: { callback: () => history.push('/dashboard') }
    })
  }
  const onSkip = () => {
    MP.track(OnboardingEvents.SKIP_EMAILS, {}, { send_immediately: true })
    dispatch({
      type: FETCH_USER,
      payload: { callback: () => history.push('/dashboard') }
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getEmailsEntered = () => {
    return emails
  }

  useEffect(() => {
    const maxEmptyEmails = Math.min(3, 3 - getEmailsEntered().length - serviceEmails.length)
    const emptyEmails = Array(Math.max(0, maxEmptyEmails - 1)).fill('')
    if (getEmailsEntered().length < maxEmptyEmails) {
      addEmptyEmail(emptyEmails)
    }
  }, [serviceEmails, getEmailsEntered, addEmptyEmail])

  return (
    <>

      <StyledOnboardingText>
        Optional: In some cases, your commits might be associated with different email addresses.
      </StyledOnboardingText>
      <Typography variant='body2' className={classes.text}>
        We suggest adding all email addresses associated with your account.
        You can also add them later in your account settings.
      </Typography>
      <StyledForm onSubmit={confirmEmails}>
        <MultipleEmails
          emails={serviceEmails}
          disabled
        />
        {
          !serviceEmails.includes(DEMO_EMAIL)
            ? (
              <>
                <MultipleEmails
                  emails={[DEMO_EMAIL]}
                  margin={false}
                  disabled
                />
                <Typography variant='body2' className={classes.demoWarning}>
                  * An example secondary email associated with the example
                  repository will be added to your account. You can remove it later
                </Typography>
              </>
              )
            : null

        }
        <MultipleEmails
          handleEmailChange={handleEmailChange}
          addEmptyEmail={addEmptyEmail}
          emails={emails}
        />
        <OnboardingButtons
          confirm={() => null}
          confirmText='Start Processing'
          confirmType='submit'
          backText='Skip'
          back={!saving && onSkip}
          disabled={saving}
        />
      </StyledForm>
      <FailedRepositories
        classes={classes}
        locationState={locationState}
        hasFailures={hasFailures}
      />
    </>
  )
}
