import React, { useState } from 'react'
import styled from '@emotion/styled'
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Button,
  makeStyles
} from '@material-ui/core'

import { ReactComponent as Github } from '@/icons/github.svg'
import { ReactComponent as Gitlab } from '@/icons/gitlab.svg'
import ModalClose from '@/components/ModalClose'
import BrowseRepositoriesList from '@/components/BrowseRepositoriesList'
import { MAX_REPOSITORIES_PER_SELECTION } from '@/enums/repositories'

const StyledDialogWrapper = styled.div`
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
`

const useStyles = makeStyles((theme) => ({
  h2: {
    marginTop: 0
  },
  h3: {
    fontSize: 'var(--text-xl)',
    color: 'var(--color-gray-500)',
    marginRight: 'auto',
    [theme.breakpoints.down('xs')]: {
      fontSize: 'var(--text-md)',
    }
  },
  body2: {
    marginTop: '20px'
  },
  dialogActions: {
    justifyContent: 'space-between'
  },
  dialogPaper: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      margin: '120px 0 0 0',
      maxHeight: 'none',
      height: '100%',
      borderRadius: 0
    }
  },
  dialogTitle: {
    paddingBottom: 0
  },
  disabledRepositoriesWarning: {
    fontSize: 'var(--text-xxs)',
    margin: '0 0 5px 0',
    color: 'var(--color-gray-300)'
  }
}))

const StyledGitServiceHeading = styled.div`
  display: flex;
  justify-content: center;
  color: var(--color-gray-400);
  margin-bottom: 20px;
`

const StyledRepositoryBrowser = styled.div`

`

const GitService = (props) => {
  const {
    service
  } = props

  return (
    <StyledGitServiceHeading>
      {service === 'github'
        ? (
          <Github width='42' height='42' />
          )
        : (
          <Gitlab width='44' height='40' />
          )}
    </StyledGitServiceHeading>
  )
}

export default function BrowseRepositoriesDialog (props) {
  const {
    open,
    service,
    handleClose,
    preSelected,
    handleAddRepositories,
    customClose,
    externalRepoCount,
    currentRepositories
  } = props
  // const [repositorySearch, setRepositorySearch] = useState('');
  const [selectedRepositories, setSelectedRepositories] = useState([])
  const classes = useStyles()

  const onConfirm = () => {
    handleAddRepositories(selectedRepositories, service)
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='sm'
      PaperProps={{
        className: classes.dialogPaper
      }}
      fullWidth
    >
      {
        customClose || (
          <ModalClose
            onClick={handleClose}
          />
        )
      }
      <StyledDialogWrapper>
        <DialogTitle
          id='alert-dialog-title'
          className={classes.dialogTitle}
          disableTypography
        >
          <GitService service={service} />
          <Typography
            className={classes.h3}
            variant='h3'
            align='center'
          >
            Select Repositories to Process
          </Typography>
          <Typography
            className={classes.body2}
            variant='body2'
          >
            You may add a maximum of {MAX_REPOSITORIES_PER_SELECTION}. Only public repositories are supported now.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <StyledRepositoryBrowser>
            <BrowseRepositoriesList
              service={service}
              preSelected={preSelected}
              externalRepoCount={externalRepoCount}
              selectedRepositories={selectedRepositories}
              handleSelectedRepositories={setSelectedRepositories}
              handleAddRepositories={handleAddRepositories}
              currentRepositories={currentRepositories}
              inDialog
            />
          </StyledRepositoryBrowser>
          <Typography
            variant='body2'
            className={classes.disabledRepositoriesWarning}
          >
            * Repositories are disabled in the list if they have already
            been added or if you already reached the maximum that you can add at one time.
          </Typography>
        </DialogContent>
        <DialogActions
          className={classes.dialogActions}
          disableSpacing
        >
          <Button
            onClick={handleClose}
            variant='outlined'
            color='primary'
            autoFocus
          >
            Back
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={onConfirm}
            autoFocus
            id='ConfirmBrowseRepositorySelection'
          >
            Confirm
          </Button>
        </DialogActions>
      </StyledDialogWrapper>
    </Dialog>
  )
}
