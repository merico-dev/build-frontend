import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import {
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  makeStyles
} from '@material-ui/core'

import ModalClose from '@/components/ModalClose'
import useAddField from '@/utils/useAddField'
import MultipleEmails from './MultipleEmail'

const useStyle = makeStyles({
  title: {
    marginTop: '61px'
  },
  summary: {
    marginBottom: '40px'
  }
})

const StyledWrapper = styled.form`
  max-width: 740px;
  margin: auto;
`

export default function AddEmailDialog (props) {
  const {
    open,
    handleClose,
  } = props
  const [emails, setEmails] = useState([])

  const {
    addEmptyEmail,
    handleEmailChange
  } = useAddField({ setEmails })

  useEffect(() => {
    if (open) {
      setEmails([''])
    }
  }, [open])

  const classes = useStyle()

  const submitEmails = (e) => {
    e.preventDefault()
    handleClose(emails)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='md'
      fullWidth
    >
      <ModalClose
        onClick={handleClose}
      />
      <StyledWrapper
        onSubmit={submitEmails}
      >
        <Typography
          variant='h2'
          align='center'
          className={classes.title}
        >
          Add Committer Emails
        </Typography>
        <DialogContent>
          <DialogContentText
            id='alert-dialog-description'
            variant='body1'
            align='left'
            className={classes.summary}
          >
            In some cases, your commits might be associated with multiple Emails.
            Missing Emails will cause incomplete data on Merico Build.
          </DialogContentText>
          <MultipleEmails
            addEmptyEmail={addEmptyEmail}
            handleEmailChange={handleEmailChange}
            emails={emails}
          />
        </DialogContent>
        <DialogActions disableSpacing>
          <Button
            color='primary'
            variant='contained'
            type='submit'
          >
            Add
          </Button>
        </DialogActions>
      </StyledWrapper>
    </Dialog>
  )
}
