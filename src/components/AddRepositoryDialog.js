import React, { useState, useEffect, useCallback } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import { ReactComponent as Github } from '@/icons/github.svg'
import { ReactComponent as Gitlab } from '@/icons/gitlab.svg'
import HelpPopover from '@/components/HelpPopover'
import BrowseRepositoriesDialog from '@/components/BrowseRepositoriesDialog'
import AddRepositoryByUrl from '@/components/AddRepository/AddRepositoryByUrl'
import ModalClose from '@/components/ModalClose'
import { ADD_REPOSITORIES, SET_ADD_REPOSITORIES_RESPONSE } from '@/store/reducers/repositories'
import SelectedRepositories from '@/components/SelectedRepositories'
import RepositoryStatusMessage from '@/components/AddRepository/RepositoryStatusMessage'
import { MP, RepositoryEvents } from '@/utils/mixpanel'
import RepositoryStatusTitle from '@/components/AddRepository/RepositoryStatusTitle'
import RepositoryProcessConfirm from '@/components/AddRepository/RepositoryProcessConfirm'

const useStyles = makeStyles((theme) => ({
  h2: {
    marginTop: 0,
    [theme.breakpoints.down('xs')]: {
      fontSize: 'var(--text-xl)',
      textAlign: 'left'
    }
  },
  h3: {
    color: 'var(--color-gray-500)',
    marginRight: 'auto'
  },
  button: {
    marginLeft: '20px',
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0'
    }
  },
  dialogButton: {
    minWidth: '86px',
    margin: '20px 47px 0',
    [theme.breakpoints.up('md')]: {
      margin: '0 47px',
    },
    [theme.breakpoints.down('xs')]: {
      margin: '0'
    }
  }
}))

const StyledRepositoryBrowse = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
`

const StyledDialogWrapper = styled.div`
  margin: 0 auto;
  ${({ limitWidth }) => (
    limitWidth
      ? 'max-width: 660px;'
      : 'padding-bottom: 20px;'
  )}
`

const ProviderList = ({ handleBrowserOpen }) => {
  const {
    data: userData
  } = useSelector((state) => state.user)
  const classes = useStyles()

  const githubButton = userData.githubUsername && (
    <Button
      variant='contained'
      color='primary'
      className={classes.button}
      onClick={() => handleBrowserOpen('github')}
    ><Github width='14' height='14' />&nbsp;Browse GitHub
    </Button>
  )

  const gitlabButton = userData.gitlabUsername && (
    <Button
      variant='contained'
      color='primary'
      className={classes.button}
      onClick={() => handleBrowserOpen('gitlab')}
    ><Gitlab width='14' height='12' />&nbsp;Browse GitLab
    </Button>
  )

  return (
    <>
      {githubButton}
      {gitlabButton}
    </>
  )
}

export default function AddRepositoryDialog (props) {
  const {
    open,
    handleClose,
    currentRepositories
  } = props

  const [repositoryList, setRepositoryList] = useState({})
  const [repositoryExternalList, setRepositoryExternalList] = useState([])
  const [browserVisibility, setBrowserVisibility] = useState(false)
  const [gitService, setGitService] = useState('')
  const [success, setSuccess] = useState(false)
  const classes = useStyles()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const {
    addRepositoriesReponse
  } = useSelector((state) => state.repositories)
  useEffect(() => {
    let timer = 0
    const isSuccessfull = (
      addRepositoriesReponse &&
      !addRepositoriesReponse?.failures?.length &&
      !addRepositoriesReponse?.warnings?.length &&
      addRepositoriesReponse?.successes?.length
    )
    if (open && success && isSuccessfull) {
      timer = window.setTimeout(handleClose, 2500)
    }

    if (open &&
      addRepositoriesReponse &&
      addRepositoriesReponse?.failures &&
      addRepositoriesReponse?.failures?.length) {
      addRepositoriesReponse.failures.forEach((failure) => {
        MP.track(RepositoryEvents.ADD_REPO_FAILURE, {
          Repository: failure.project.name,
          'Git URL': failure.project.gitUrl,
          'Error Code': failure.code,
          'Error Message': failure.message
        })
      })
    }
    return () => {
      window.clearTimeout(timer)
    }
  }, [open, success, addRepositoriesReponse, handleClose])

  useEffect(() => {
    if (open === true) {
      setSuccess(false)
      setRepositoryList({})
      setRepositoryExternalList([])
    }
  }, [setSuccess, setRepositoryList, open])

  const removeRepository = useCallback((url, service) => {
    setRepositoryList((list) => {
      if (!list[service].length) {
        return list
      }

      return {
        ...list,
        [service]: list[service].filter((repository) => repository.url !== url)
      }
    })
  }, [setRepositoryList])

  const handleBrowserClose = () => {
    setBrowserVisibility(false)
  }

  const handleBrowserOpen = (service) => {
    setBrowserVisibility(true)
    setGitService(service)
  }

  const handleAddRepositories = (addRepositories, service) => {
    if (!addRepositories?.length) {
      setRepositoryList((repositories) => {
        return {
          ...repositories,
          [service]: []
        }
      })
      return
    }

    setRepositoryList((repositories) => {
      const repositoriesWithProvider = addRepositories.map((repository) => ({
        ...repository,
        provider: service
      }))
      return {
        ...repositories,
        [service]: [...repositoriesWithProvider]
      }
    })
  }

  const handleAddDialogClose = () => {
    // clear add repositories response
    dispatch({
      type: SET_ADD_REPOSITORIES_RESPONSE,
      payload: null
    })
    handleClose(success)
  }

  const hasSelectedRepositories = Object.keys(repositoryList).some(
    (service) => (repositoryList[service].length > 0)
  )

  const hasExternalRepositories = repositoryExternalList.length > 0

  const hasAddedRepositories = hasSelectedRepositories || hasExternalRepositories

  const submitRepositories = () => {
    let repositoriesToSubmit = []
    Object.keys(repositoryList).forEach((key) => {
      repositoriesToSubmit = repositoriesToSubmit.concat(repositoryList[key])
    })
    // #578 Support External Repository URLs
    if (hasExternalRepositories) {
      repositoriesToSubmit = repositoriesToSubmit.concat(repositoryExternalList)
    }
    dispatch({ type: ADD_REPOSITORIES, payload: repositoriesToSubmit })
    MP.track(
      RepositoryEvents.ADD_REPO,
      {
        'Added Count': repositoriesToSubmit.length,
        Repositories: repositoriesToSubmit.map(
          (repo) => repo.name
        ),
        'Repository URLs': repositoriesToSubmit.map(
          (repo) => repo.gitUrl
        )
      }
    )
    setSuccess(true)
  }

  const getBrowseListCount = () => {
    let listCount = 0
    Object.keys(repositoryList).forEach(
      (service) => { listCount = repositoryList[service].length }
    )
    return listCount
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleAddDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='md'
        fullWidth
      >
        <ModalClose
          onClick={handleAddDialogClose}
        />
        <StyledDialogWrapper limitWidth={!success}>
          {
            !success
              ? (
                <>
                  <DialogTitle
                    id='alert-dialog-title'
                    disableTypography
                  >
                    <Typography
                      variant='h2'
                      align='center'
                      className={classes.h2}
                    >
                      Add New Repositories
                    </Typography>
                  </DialogTitle>
                  <DialogContent>
                    <StyledRepositoryBrowse>
                      <Typography
                        variant='h3'
                        className={classes.h3}
                      >
                        Browse Repositories&nbsp;
                        <HelpPopover
                          content='Public repositories'
                        >
                          <QuestionCircle width='17.5' height='17.5' />
                        </HelpPopover>
                      </Typography>
                      <ProviderList
                        handleBrowserOpen={handleBrowserOpen}
                      />
                    </StyledRepositoryBrowse>
                    <SelectedRepositories
                      repositoryList={repositoryList}
                      removeRepository={removeRepository}
                      selectedService={gitService}
                      dialogMode
                    />
                    <AddRepositoryByUrl
                      repositoryExternalList={repositoryExternalList}
                      setRepositoryExternalList={setRepositoryExternalList}
                      currentRepositories={currentRepositories}
                      service={gitService}
                      user={user.data}
                      browseList={repositoryList[gitService]}
                      browseListCount={getBrowseListCount}
                      dialogMode
                    />
                  </DialogContent>
                  <DialogActions disableSpacing>
                    <Button
                      onClick={() => submitRepositories()}
                      variant='contained'
                      color='primary'
                      disabled={!hasAddedRepositories}
                      autoFocus
                      className={classes.dialogButton}
                      id='AddRepositoryButton'
                    >
                      Add
                    </Button>
                  </DialogActions>
                </>
                )
              : (
                <>
                  <DialogTitle
                    id='alert-dialog-title'
                    disableTypography
                  >
                    <Typography
                      variant='h2'
                      align='center'
                      className={classes.h2}
                    >
                      <RepositoryStatusTitle response={addRepositoriesReponse} />
                    </Typography>
                  </DialogTitle>
                  <RepositoryStatusMessage response={addRepositoriesReponse} />
                  <RepositoryProcessConfirm
                    addRepositoriesReponse={addRepositoriesReponse}
                    handleClose={handleClose}
                  />
                </>
                )
          }
        </StyledDialogWrapper>
      </Dialog>
      <BrowseRepositoriesDialog
        open={browserVisibility && open}
        service={gitService}
        preSelected={repositoryList[gitService] || []}
        handleClose={handleBrowserClose}
        handleAddRepositories={handleAddRepositories}
        externalRepoCount={repositoryExternalList.length}
        currentRepositories={currentRepositories}
      />
    </>
  )
}
