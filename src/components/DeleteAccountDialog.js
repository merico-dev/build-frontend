import React, { useState } from 'react'
import styled from '@emotion/styled'
import {
  Typography,
  Button,
  withStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core'

import { deleteData } from '@/utils/fetchData'
import PageLoading from '@/components/PageLoading'
import { Link, useHistory } from 'react-router-dom'

const StyledDialogButton = withStyles((theme) => ({
  sizeLarge: {
    minWidth: '240px',
    margin: '20px 47px 0',
    [theme.breakpoints.up('md')]: {
      margin: '0 47px',
    }
  }
}))(Button)

const StyledTypography = withStyles({
  h2: {
    marginTop: 0
  }
})(Typography)

const StyledPageLoading = styled(PageLoading)`
  margin-right: 15px;
  margin-bottom: 50px;
`

export default function DeleteAccountDialog (props) {
  const {
    open,
    handleClose,
  } = props

  const history = useHistory()
  const [deleting, setDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)

  const deleteAccount = async () => {
    setDeleting(true)
    setErrorMessage(false)
    try {
      await deleteData('/account')
      setDeleting(false)
      handleClose()
      history.replace('/account/deleted')
    } catch (e) {
      setDeleting(false)
      setErrorMessage(
        <>
          We were unable to delete your account, please try again or <Link to='/contact'>contact us</Link>
        </>
      )
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='md'
      disableBackdropClick
      fullWidth
    >
      <DialogTitle
        id='alert-dialog-title'
        disableTypography
      >
        <StyledTypography variant='h2' align='center'>
          Are you sure about deleting your account?
        </StyledTypography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id='alert-dialog-description'
          variant='body1'
          align='center'
        >
          Your profile and repository analysis will be permanently deleted.
        </DialogContentText>
      </DialogContent>
      {errorMessage && <Typography variant='body2' color='error' align='center'>{errorMessage}</Typography>}
      {
        deleting
          ? (
            <Typography
              variant='body1'
              color='error'
              align='center'
              component='div'
              gutterBottom
            >
              <StyledPageLoading
                size={20}
              />
              Deleting your account...
            </Typography>
            )
          : (
            <DialogActions disableSpacing>
              <StyledDialogButton
                onClick={handleClose}
                variant='contained'
                color='primary'
                size='large'
                autoFocus
              >
                Cancel
              </StyledDialogButton>
              <StyledDialogButton
                onClick={deleteAccount}
                variant='outlined'
                color='primary'
                size='large'
              >
                Delete My Account
              </StyledDialogButton>
            </DialogActions>
            )
      }
    </Dialog>
  )
}
