import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import {
  withStyles,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox
} from '@material-ui/core'
import { DateTime } from 'luxon'

import StyledRepositoryList from '@/components/StyledRepositoryList'
import ModalClose from '@/components/ModalClose'
import { Readiness } from '@/enums/repositoryReadiness'
import Sandclock from '@/icons/sandclock.svg'

const StyledDialogWrapper = styled.div`
  margin: 0 auto;
  ${({ limitWith }) => (limitWith
    ? 'max-width: 660px;'
    : 'padding-bottom: 20px;'
  )}
`

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  ${({ isReady }) => !isReady && (`
    background-image: url('${Sandclock}');
    background-repeat: no-repeat;
    background-position: right center;
  `)}
  ${({ disabledStyle }) => disabledStyle && (`
    color: var(--color-gray-300);
  `)}
`

const StyledTypography = withStyles({
  h2: {
    margin: '8px 0 30px'
  },
  h3: {
    color: 'var(--color-gray-500)'
  }
})(Typography)

const StyledDialogActions = withStyles({
  root: {
    padding: '30px 8px 30px 8px'
  }
})(DialogActions)

const getInitialCheckedRepos = (repositories) => {
  const checked = repositories.filter(({ isFavorite }) => isFavorite)

  if (!checked.length) {
    const orderedSlice = [...repositories].sort((a, b) => {
      const dateA = DateTime.fromISO(a.lastSyncTime)
      const dateB = DateTime.fromISO(b.lastSyncTime)
      const orderedList = dateB.diff(dateA)
      return orderedList
    }).slice(0, 6)

    return orderedSlice
  }

  return checked
}

export default function SelectRepositoriesDialog (props) {
  const {
    repositories = [],
    onRepositoriesSelected,
    title,
    subtitle,
    open,
    handleClose
  } = props
  const selectRepositoriesModal = useRef()
  const [error, setError] = useState('')
  const [checkedRepositories, setCheckedRepositories] = useState([])
  const [maxRepositories, setMaxRepositories] = useState(false)
  useEffect(() => {
    if (open === true) {
      setCheckedRepositories(
        getInitialCheckedRepos(repositories)
      )
    }
  }, [repositories, setCheckedRepositories, open])
  useEffect(() => {
    setMaxRepositories(checkedRepositories.length >= 6)
  }, [
    checkedRepositories.length,
    setMaxRepositories,
    maxRepositories
  ])
  useLayoutEffect(() => {
    window.requestAnimationFrame(() => {
      if (
        selectRepositoriesModal.current &&
        open
      ) {
        selectRepositoriesModal.current.scrollTo(0, 0)
      }
    })
  }, [open])
  const resetError = () => setError('')
  const handleRepositoryCheck = ({ target }, changedRepository) => {
    const { checked } = target
    resetError()
    if (checked) {
      setCheckedRepositories((repositories) => {
        if (repositories.length >= 6) {
          return repositories
        }
        if (repositories.find((repository) => repository.gitUrl === changedRepository.gitUrl)) {
          return repositories
        }
        return [...repositories, changedRepository]
      })
      return
    }
    setCheckedRepositories((repositories) => {
      return repositories.filter((repository) => repository.gitUrl !== changedRepository.gitUrl)
    })
  }
  const handleRepositoriesSubmit = () => {
    if (!checkedRepositories.length) {
      setError('Please select at least one repository.')
      return
    }
    const checkedList = checkedRepositories.map(({ gitUrl }) => gitUrl)
    const selectedRepositories = repositories.map((repository) => {
      return {
        ...repository,
        isFavorite: checkedList.includes(repository.gitUrl)
      }
    })
    resetError()
    handleClose()
    onRepositoriesSelected(selectedRepositories)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      maxWidth='md'
      PaperProps={{
        ref: selectRepositoriesModal
      }}
      fullWidth
    >
      <ModalClose
        onClick={handleClose}
      />
      <StyledDialogWrapper>
        <>
          <DialogTitle
            id='alert-dialog-title'
            disableTypography
          >
            <StyledTypography variant='h2' align='center'>
              {title}
            </StyledTypography>
            <StyledTypography variant='h3' align='center'>
              {subtitle}
            </StyledTypography>
          </DialogTitle>
          <DialogContent>
            <StyledRepositoryList data-test='select-repositories-dialog-repositories' marginLess>
              {repositories.map((repository) => {
                const ready = repository.status === Readiness.READY
                const checked = checkedRepositories.some(
                  ({ gitUrl }) => gitUrl === repository.gitUrl
                ) && ready
                const disabledStyle = (maxRepositories && !checked) || !ready

                return (
                  <StyledLabel
                    key={repository.name}
                    disabledStyle={disabledStyle}
                    isReady={ready}
                  >
                    <Checkbox
                      onChange={(e) => ready && handleRepositoryCheck(e, repository)}
                      value={repository.gitUrl}
                      color='primary'
                      checked={checked}
                    />
                    {repository.name}
                  </StyledLabel>
                )
              })}
            </StyledRepositoryList>
          </DialogContent>
          {error && <Typography color='error' variant='body2'>{error}</Typography>}
          <StyledDialogActions disableSpacing>
            <Button
              variant='contained'
              color='primary'
              onClick={handleRepositoriesSubmit}
              disabled={!checkedRepositories.length}
            >Confirm Selection
            </Button>
          </StyledDialogActions>
        </>
      </StyledDialogWrapper>
    </Dialog>
  )
}
