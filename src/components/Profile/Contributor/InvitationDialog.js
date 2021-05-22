import React, { useState, useEffect } from 'react'
import { postData } from '@/utils/fetchData'
import styled from '@emotion/styled'
import ModalClose from '@/components/ModalClose'

import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  TextField,
  FormControl,
  FormHelperText,
  DialogContent,
  Typography,
} from '@material-ui/core'

const StyledAlert = styled.div`
  color: var(--color-gray-300);
  background-color: rgb(240, 240, 240);
  display: flex;
  flex-direction: row;
  font-size: var(--text-sm);
  padding: 16px 24px;
  line-height: 110%;
  justify-content: left;
  margin: -24px 0;

  ${({ align }) => (align === 'center' && `
    justify-content: center;
  `)}

  ${({ severity }) => (severity === 'info' && `
    color: rgb(13, 60, 97);
    background-color: rgb(232, 244, 253);
  `)}

  ${({ severity }) => (severity === 'success' && `
    color: rgb(30, 70, 32);
    background-color: rgb(237, 247, 237);
  `)}

  ${({ severity }) => (severity === 'error' && `
    color: rgb(97, 26, 21);
    background-color: rgb(253, 236, 234);
  `)}
`

const sendContributorInvitation = async (inviteeEmail, inviteeMessage, setInvitationStatus) => {
  try {
    const invitationPayload = {
      contributorEmail: inviteeEmail,
      message: inviteeMessage.trim()
    }
    await postData('/contributors/invite', invitationPayload, {}, true)
    setInvitationStatus((status) => {
      return { ...status, sent: true, errors: [] }
    })
    // console.log(invitationPayload)
  } catch (e) {
    setInvitationStatus((status) => {
      return { ...status, sent: false, errors: [e.message] }
    })
  }
}

function InvitationDialog (props) {
  const {
    open = false,
    contributorEmail,
    onDialogClose = () => {},
    onSend = () => {},
    gitUrl = '(my project)',
    maxMessageLength = 255,
    dialogTitle = 'Invite a Contributor'
  } = props

  /* eslint-disable max-len */
  const defaultInviteMessage = `I'm using this tool for analytics on ${gitUrl.replace('git://', 'https://').replace('.git', '')}. If you make an account it gives better data.
  `
  /* eslint-enable max-len */

  const [invitationStatus, setInvitationStatus] = useState({ sent: false, errors: [] })
  const [inviteeMessage, setInviteeMessage] = useState(defaultInviteMessage)
  const [messageLimitExceeded, setMessageLimitExceeded] = useState(false)

  const closeInvitationDialog = () => {
    setInviteeMessage(defaultInviteMessage)
    setInvitationStatus((status) => {
      return { ...status, sent: false, errors: [] }
    })
    onDialogClose()
  }

  const sendInvitation = () => {
    onSend(contributorEmail, inviteeMessage, setInvitationStatus)
  }

  useEffect(() => {
    setMessageLimitExceeded(inviteeMessage.trim().length > maxMessageLength)
  }, [inviteeMessage, maxMessageLength])

  useEffect(() => {
    setInviteeMessage(defaultInviteMessage)
  }, [gitUrl, defaultInviteMessage])

  return (
    <Dialog
      open={open}
      onClose={closeInvitationDialog}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='sm'
      fullWidth
      data-test='contributor-profile-invite-dialog'
    >
      <ModalClose
        onClick={closeInvitationDialog}
      />
      <DialogTitle
        id='alert-dialog-title'
        disableTypography
      >
        <Typography
          variant='h2'
          align='center'
          style={{ marginTop: 0 }}
        >
          {dialogTitle}
        </Typography>
      </DialogTitle>
      {invitationStatus?.sent && invitationStatus?.errors?.length === 0 && (
        <StyledAlert align='center' severity='success'>
          The Invitation has been sent to &nbsp; <strong>{contributorEmail}</strong>
        </StyledAlert>
      )}
      {!invitationStatus?.sent && invitationStatus?.errors?.length > 0 && (
        <StyledAlert align='center' severity='error'>
          {invitationStatus?.errors?.pop()}
        </StyledAlert>
      )}
      <DialogContent>
        <Box style={{ padding: '42px 42px 12px 42px' }}>
          <FormControl fullWidth style={{ marginBottom: '14px' }}>
            <TextField
              type='email'
              variant='outlined'
              label='Contributor Email'
              // onChange={({ target }) => setInviteeEmail(target.value)}
              value={contributorEmail}
              placeholder={contributorEmail}
              id='inviteeEmail'
              required
              InputProps={{
                readOnly: true,
              }}
            />
            <FormHelperText id='invitee-email-helper-text'>
              &#9786; We'll send a message to this Contributor's Primary E-mail
            </FormHelperText>
            <p>&nbsp;</p>
            <TextField
              type='text'
              variant='filled'
              label='Invitation Message'
              onChange={({ target }) => setInviteeMessage(target.value)}
              value={inviteeMessage}
              id='inviteeMessage'
              multiline
              rows={4}
              rowsMax={4}
              autoFocus
              required
              disabled={invitationStatus?.sent}
            />
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions disableSpacing>
        {!invitationStatus?.sent && (
          <>
            <Button
              onClick={() => sendInvitation()}
              variant='contained'
              color='primary'
              disabled={!contributorEmail || !inviteeMessage || invitationStatus?.sent || messageLimitExceeded}
              autoFocus
              id='InviteContributorButton'
              data-test='contributor-profile-invite-send'
            >
              Send Invitation
            </Button>
            <Button
              variant='contained'
              color='secondary'
              onClick={closeInvitationDialog}
              style={{ marginLeft: '10px' }}
              data-test='contributor-profile-invite-cancel'
            >
              Cancel
            </Button>
          </>
        )}
        {invitationStatus?.sent && (
          <Button
            variant='contained'
            color='secondary'
            onClick={closeInvitationDialog}
            style={{ marginLeft: '10px' }}
            data-test='contributor-profile-invite-continue'
          >
            Continue
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export { sendContributorInvitation, InvitationDialog }
