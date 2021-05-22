import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Button,
  withStyles
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import { DELETE_REPOSITORIES, FETCH_LIST } from '@/store/reducers/repositories'
import ModalClose from '@/components/ModalClose'
import { Trans } from '@lingui/macro'
import { LOADING, SUCCEED } from '@/store/statusTypes'
import FetchStatus from './FetchStatus'

const StyledTypography = withStyles({
  h2: {
    marginTop: 0,
    marginBottom: '14px'
  },
  h3: {
    fontSize: 'var(--text-xl)',
    color: 'var(--color-gray-500)',
    marginRight: 'auto',
    marginBottom: 0
  },
  body1: {
    textAlign: 'center',
    marginBottom: '16px'
  }
})(Typography)

const StyledDialogTitle = withStyles({
  root: {
    paddingBottom: 0
  }
})(DialogTitle)

const StyledButton = withStyles({
  root: {
    '&:last-of-type': {
      marginLeft: '100px'
    }
  }
})(Button)

function DeleteRepositoriesReport (props) {
  const {
    status
  } = props

  if (status !== SUCCEED) {
    return (
      <FetchStatus
        status={status}
        failure={<Trans>Unable to delete selected repositories.</Trans>}
      />
    )
  }

  return (
    <Trans>
      The selected repositories have been deleted.
    </Trans>
  )
}

export default function DeleteRepositoriesDialog (props) {
  const {
    open,
    handleClose,
    repositories,
    onSuccess
  } = props
  const dispatch = useDispatch()
  const [complete, setComplete] = useState(false)
  const {
    deleteRepositoriesStatus
  } = useSelector((state) => state.repositories)

  const handleDeleteRepositories = () => {
    dispatch({
      type: DELETE_REPOSITORIES,
      payload: {
        gitUrls: repositories,
        callback: {
          type: FETCH_LIST
        }
      },
    })
    setComplete(true)
    onSuccess(repositories)
  }

  useEffect(() => {
    if (open) {
      setComplete(false)
    }
  }, [setComplete, open])

  const canCloseModal = (
    !complete || (Boolean(complete) && deleteRepositoriesStatus !== LOADING)
  )

  return (
    <>
      <Dialog
        open={open}
        onClose={canCloseModal ? handleClose : null}
        aria-label='Delete Repository Popup'
        maxWidth='md'
        fullWidth
      >
        {canCloseModal && (
          <ModalClose
            onClick={handleClose}
          />
        )}
        {
          complete
            ? (
              <DialogContent>
                <StyledDialogTitle
                  id='alert-dialog-title'
                  disableTypography
                >
                  <StyledTypography
                    variant='h2'
                    align='center'
                    style={{ marginBottom: '50px' }}
                    id='DeletedRepositoryMessage'
                  >
                    <DeleteRepositoriesReport status={deleteRepositoriesStatus} />
                  </StyledTypography>
                </StyledDialogTitle>
              </DialogContent>
              )
            : (
              <>
                <DialogContent>
                  <StyledDialogTitle
                    id='alert-dialog-title'
                    disableTypography
                  >
                    <StyledTypography variant='h2' align='center'>
                      <Trans>Are you sure about deleting the selected repositories?</Trans>
                    </StyledTypography>
                  </StyledDialogTitle>
                  <StyledTypography variant='body1'>
                    <Trans>
                      The selected repositories will only be removed from
                      Merico and will not affect GitHub or GitLab.
                    </Trans>
                  </StyledTypography>
                </DialogContent>
                <DialogActions disableSpacing>
                  <StyledButton
                    onClick={handleDeleteRepositories}
                    variant='outlined'
                    color='primary'
                  >
                    <Trans>Delete</Trans>
                  </StyledButton>
                  <StyledButton
                    variant='contained'
                    color='primary'
                    onClick={handleClose}
                    autoFocus
                  >
                    <Trans>Cancel</Trans>
                  </StyledButton>
                </DialogActions>
              </>
              )
        }
      </Dialog>
    </>
  )
}
