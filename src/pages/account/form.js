/** @jsx jsx */
import { jsx } from '@emotion/core'
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import styled from '@emotion/styled'
import {
  Typography,
  Button,
  TextField,
  makeStyles,
  IconButton
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as Check } from '@/icons/check.svg'
import { ReactComponent as Times } from '@/icons/times.svg'
import { ReactComponent as Plus } from '@/icons/plus.svg'
import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'

import Panel from '@/layouts/Panel'
import { mdMedia } from '@/styles/snippets/responsive'
import { postData } from '@/utils/fetchData'
import DeleteAccountDialog from '@/components/DeleteAccountDialog'
import AddEmailDialog from '@/components/AddEmailDialog'
import HelpPopover from '@/components/HelpPopover'
import BackToDashboardLink from '@/components/BackToDashboardLink'
import { sendEvent } from '@/utils/analyticsEvents'
import scrollbar from '@/styles/snippets/scrollbar'
import { FETCH_USER } from '@/store/reducers/user'

import { MP, AccountEvents } from '@/utils/mixpanel'
import ErrorBoundary from '@/components/ErrorBoundary'
import { dashboardLink } from '@/utils/dashboardLink'

const StyledAccountWrapper = styled.form`
  padding: 30px 25px 0;
  max-width: 743px;
  width: 100%;
  margin: 0 auto 83px;

  ${mdMedia(`
    margin-top: 70px;
    padding: 30px 0 0;
  `)}
`

const StyledAccountContent = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  flex-wrap: wrap;

  ${mdMedia(`
    margin-top: 52px;
  `)}
`

const StyledAccountColumn = styled.div`
  width: 100%;
  margin: 0 auto;
  flex-direction: column;
  display: flex;
  align-items: center;

  &:first-of-type {
    margin-bottom: 50px;
  }

  ${mdMedia(`
    width: 300px;
    &:first-of-type {
      margin-bottom: 0;
    }
  `)}
`

const StyleButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
`

const StyleFormBottom = styled.div`
  margin: 60px auto 80px;
`

const StyledActions = styled.div`
  margin: auto;
`

const useStyles = makeStyles({
  text: {
    marginTop: '50px'
  },
  submitMessage: {
    margin: '10px 0',
    color: 'var(--color-primary-400)',
    fontWeight: 'bold',
    width: '100%'
  },
  addEmails: {
    background: 'var(--color-primary-400)',
    color: '#fff',
    marginTop: '10px',
    boxShadow: 'var(--elevation-1)',
    '&:hover': {
      background: 'var(--color-primary-400)'
    }
  }
})

const StyledCheck = styled(Check)`
  margin-right: 5px;
`

const StyledTimes = styled(Times)`
  cursor: pointer;
`

const StyledEmailList = styled.div`
  width: 100%;
  height: 244px;
  border-radius: var(--radius-md);
  padding: 10px;
  border: 2px solid var(--color-gray-400);
  ${scrollbar({ width: '8px' })}
`

const StyledEmailListLabel = styled.div`
  font-size: var(--text-xs);
  text-align: left;
  margin: 0 auto 8px 0;
  color: var(--color-gray-400);
`

const StyledEmailItem = styled.div`
  height: 22px;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr 14px;
  color: var(--color-gray-400);
  margin-bottom: 10px;
`

const StyledEmailItemText = styled.div`
  max-width: 98%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const SubmitButton = (props) => {
  const {
    saving
  } = props

  return (
    <>
      <Button
        color='primary'
        size='medium'
        variant='contained'
        disabled={saving}
        type='submit'
      >
        {(saving) ? 'Saving changes' : 'Save'}
      </Button>
    </>
  )
}

export function Account () {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [openEmailsDialog, setOpenEmailsDialog] = useState(false)

  const [saving, setSaving] = useState(false)
  const [accountSaved, setAccountSaved] = useState(false)
  const [accountChanged, setAccountChanged] = useState(false)
  const [name, setName] = useState('')
  // TODO: Remove e-mail
  const [email, setEmail] = useState('')
  const [github, setGithub] = useState('')
  const [gitlab, setGitlab] = useState('')
  const [website, setWebsite] = useState('')
  const [emails, setEmails] = useState([])
  const [localUserData, setLocalUserData] = useState({})
  const classes = useStyles()

  const {
    data: userData,
  } = useSelector((state) => state.user)

  useEffect(() => {
    setLocalUserData(userData)
  }, [userData])

  const resetForm = useCallback(() => {
    setEmail(localUserData?.primaryEmail || '')
    setName(localUserData?.displayName || '')
    setGitlab(localUserData?.gitlabUsername || '')
    setGithub(localUserData?.githubUsername || '')
    setWebsite(localUserData?.website || '')
    setEmails(localUserData?.UserEmails || [])
  }, [localUserData])

  const profileChanged = useCallback(() => {
    const emailDeleted = emails.find((email) => email.delete === true)
    if (name !== userData.displayName ||
        emails.length !== userData.emails.length ||
        emailDeleted !== undefined ||
        (userData.website === null && website !== '') ||
        (userData.website !== null && website !== userData.website)) {
      setAccountChanged(true)
    } else {
      setAccountChanged(false)
    }
  }, [name, website, emails, userData])

  useEffect(() => {
    resetForm()
  }, [userData, resetForm])

  useEffect(() => {
    profileChanged()
  }, [name, website, emails, profileChanged])

  useEffect(() => {
    let savedTimer = null
    if (accountSaved === true) {
      setAccountChanged(false)
      savedTimer = window.setTimeout(() => {
        setAccountSaved(false)
      }, 3000)
    }

    return () => window.clearTimeout(savedTimer)
  }, [accountSaved])

  const handleClickOpen = () => {
    sendEvent({
      event: 'gaEvent_begin_delete_account'
    })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseEmailsDialog = (newEmails) => {
    const undeleteList = []
    if (newEmails.length) {
      const filteredEmails = []
      newEmails.forEach((newEmail) => {
        if (newEmail.length <= 0) {
          return
        }

        // if e-mail exists in the database we and in out list 'undelete' it
        const existentEmail = emails.find(
          (UserEmail) => UserEmail.email === newEmail
        )
        if (existentEmail && existentEmail.id) {
          undeleteList.push(existentEmail.email)
          return
        }
        filteredEmails.push({
          email: newEmail
        })
      })
      setEmails((emails) => {
        const undeletedEmails = emails.map((UserEmail) => {
          if (
            UserEmail.delete &&
            undeleteList.some((undeleteEmail) => UserEmail.email === undeleteEmail)
          ) {
            return {
              ...UserEmail,
              delete: false
            }
          }
          return UserEmail
        })
        return [
          ...undeletedEmails,
          ...filteredEmails
        ]
      })
    }

    setOpenEmailsDialog(false)
  }

  const saveChanges = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()

      formData.append('displayName', name)
      formData.append('website', website)

      const emailsToKeep = emails.filter((UserEmail) => UserEmail.delete !== true)
      formData.append('emails', JSON.stringify(emailsToKeep.map((UserEmail) => UserEmail.email)))

      const emailsToRemove = emails.filter((UserEmail) => UserEmail.delete === true)
      formData.append('removeEmails', JSON.stringify(emailsToRemove.map((UserEmail) => UserEmail.email)))

      await postData('/account', formData, { 'content-type': 'multipart/form-data' })

      setLocalUserData({
        displayName: name,
        primaryEmail: email,
        githubUsername: github,
        gitlabUsername: gitlab,
        website,
        UserEmails: emailsToKeep
      })
      setEmails(emailsToKeep)
      setSaving(false)
      setAccountSaved(true)
      dispatch({ type: FETCH_USER })
      MP.track(AccountEvents.ACCOUNT_SETTINGS_UPDATED, {})
    } catch (e) {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    resetForm()
  }

  const removeEmails = (emailToRemove) => {
    setEmails((emails) => {
      return emails.map((UserEmail) => {
        // soft delete remote e-mails
        if (UserEmail.id && UserEmail.email === emailToRemove) {
          return {
            ...UserEmail,
            delete: true
          }
        }

        // actual removal of local emails
        if (UserEmail.email === emailToRemove) {
          return false
        }

        return UserEmail
      }).filter(Boolean)
    })
  }

  return (
    <>
      <StyledAccountWrapper onSubmit={saveChanges}>
        <Typography variant='h1'>Account</Typography>
        <StyledAccountContent>
          <StyledAccountColumn>
            <TextField
              className={classes.text}
              id='email'
              label='Communication Email'
              style={{ marginTop: 0 }}
              value={email}
              disabled
              fullWidth
            />
            {
              github
                ? (
                  <TextField
                    className={classes.text}
                    id='github'
                    label='GitHub'
                    value={github}
                    disabled
                    fullWidth
                  />
                  )
                : null
            }
            {
              gitlab
                ? (
                  <TextField
                    className={classes.text}
                    id='gitlab'
                    label='GitLab'
                    value={gitlab}
                    disabled
                    fullWidth
                  />
                  )
                : null
            }
            <TextField
              className={classes.text}
              id='name'
              label='Display Name'
              onChange={({ target }) => setName(target.value)}
              value={name}
              fullWidth
            />
            <TextField
              className={classes.text}
              id='website'
              label='Website'
              onChange={({ target }) => setWebsite(target.value)}
              value={website}
              fullWidth
            />
          </StyledAccountColumn>
          <StyledAccountColumn>
            <StyledEmailListLabel>
              Committer Emails &nbsp;
              <HelpPopover
                content='Commits using these addresses will be considered yours'
              >
                <QuestionCircle width='14.5' height='14.5' />
              </HelpPopover>
            </StyledEmailListLabel>
            <StyledEmailList>
              {
                emails.filter((email) => !email.delete).map((UserEmail) => (
                  <StyledEmailItem key={UserEmail.id || UserEmail.email}>
                    <StyledEmailItemText title={UserEmail.email}>
                      {UserEmail.email}
                    </StyledEmailItemText>
                    {!UserEmail.isVerified && (
                      <StyledTimes
                        width='14'
                        height='14'
                        onClick={() => removeEmails(UserEmail.email)}
                      />
                    )}
                  </StyledEmailItem>
                ))
              }
            </StyledEmailList>
            <IconButton
              color='primary'
              variant='contained'
              onClick={() => setOpenEmailsDialog(true)}
              className={classes.addEmails}
            >
              <Plus width='14' height='14' />
            </IconButton>
          </StyledAccountColumn>
          <StyledActions>
            <StyleFormBottom>
              <StyleButtonContainer>
                <SubmitButton
                  saving={saving}
                  accountSaved={accountSaved}
                />
                <Button
                  color='primary'
                  size='medium'
                  variant='outlined'
                  disabled={!accountChanged}
                  onClick={handleCancel}
                >
                  Reset
                </Button>
              </StyleButtonContainer>
              {
                (accountSaved)
                  ? (
                    <Typography
                      className={classes.submitMessage}
                      variant='body1'
                      color='textPrimary'
                      align='center'
                      gutterBottom
                    >
                      <StyledCheck
                        width='17'
                        height='17'
                      />
                      Changes applied successfully
                    </Typography>
                    )
                  : null
              }
            </StyleFormBottom>
            <Button
              color='primary'
              size='large'
              variant='outlined'
              onClick={handleClickOpen}
            >
              Delete Account
            </Button>
          </StyledActions>
        </StyledAccountContent>
      </StyledAccountWrapper>
      <DeleteAccountDialog
        open={open}
        handleClose={handleClose}
      />
      <AddEmailDialog
        open={openEmailsDialog}
        handleClose={handleCloseEmailsDialog}
      />
    </>
  )
}

export default function BoundedAccountForm () {
  return (
    <Panel sidebar={false} isAuthenticated>
      <Helmet>
        <title>Manage Account - Merico Build</title>
      </Helmet>
      <BackToDashboardLink to={dashboardLink()}>Back to Dashboard</BackToDashboardLink>
      <ErrorBoundary style={{ padding: '0 50px' }}>
        <Account />
      </ErrorBoundary>
    </Panel>
  )
}
