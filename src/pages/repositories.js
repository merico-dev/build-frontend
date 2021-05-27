import React, { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import { ClassNames } from '@emotion/core'
import styled from '@emotion/styled'
import { Helmet } from 'react-helmet'
import {
  Button,
  useTheme,
  useMediaQuery,
  Checkbox,
  Typography,
  Link,
  makeStyles
} from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Trans } from '@lingui/macro'
import { DateTime } from 'luxon'

import { SUCCEED } from '@/store/statusTypes'
import { FETCH_LIST, FETCH_REPO_PAGE_LIST } from '@/store/reducers/repositories'
import Panel from '@/layouts/Panel'
import PageLoading from '@/components/PageLoading'
import AdvancedTable from '@/components/AdvancedTable/AdvancedTable'
import RepositoryStatus from '@/components/RepositoryStatus'
import FetchStatus from '@/components/FetchStatus'
import { mdMedia } from '@/styles/snippets/responsive'
import AddRepositoryDialog from '@/components/AddRepositoryDialog'
import DeleteRepositoriesDialog from '@/components/DeleteRepositoriesDialog'
import { ellipsis } from '@/utils/string'
import { Readiness } from '@/enums/repositoryReadiness'
import RepositoryListActions from '@/components/RepositoryList/RepositoryListActions'

import { MP, RepositoryEvents } from '@/utils/mixpanel'
import ErrorBoundary from '@/components/ErrorBoundary'
import { isNextGenEnabled } from '@/utils/nextGen/featureFlag'

const useStyles = makeStyles({
  buttonOutlinedPrimary: {
    marginLeft: '30px',
    '&.Mui-disabled': {
      borderWidth: '2px',
      borderColor: 'var(--color-gray-300)',
      color: 'var(--color-gray-300)'
    }
  },
  repoName: {
    textDecoration: 'underline'
  },
  selectAllCheckbox: {
    padding: 0
  }
})

const StyledButtonContainer = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: flex-end;
`

const StyledSelectAll = styled.div`
  display: flex;
  justify-content: flex-end;
`

export function Repositories () {
  const poolingInterval = useRef(null)
  const classes = useStyles()
  const theme = useTheme()
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'))
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [repositoryDialog, setRepositoryDialog] = useState(false)
  const [repositoriesToDelete, setRepositoriesToDelete] = useState([])
  const [deleteRepositoriesDialogOpen, setDeleteRepositoriesDialogOpen] = useState(false)
  const alreadyTracked = useRef(false)
  const dispatch = useDispatch()
  const {
    repoPageList,
    list
  } = useSelector((state) => state.repositories)

  const setPooling = useCallback(() => {
    if (poolingInterval.current) {
      window.clearInterval(poolingInterval.current)
    }
    poolingInterval.current = window.setInterval(() => {
      dispatch({ type: FETCH_LIST })
    }, 5000)
  }, [dispatch, poolingInterval])

  // force list refresh when mounting
  useEffect(() => {
    dispatch({ type: FETCH_LIST })
  }, [dispatch])

  // update this page list when options change or the global repository list gets updated
  useEffect(() => {
    const payload = {
      sortDirection: order,
      sortColumn: orderBy,
      start: currentPage * rowsPerPage,
      count: rowsPerPage
    }

    dispatch({ type: FETCH_REPO_PAGE_LIST, payload })
    setPooling()

    return () => {
      window.clearInterval(poolingInterval.current)
    }
  }, [
    list.data,
    setPooling,
    dispatch,
    order,
    orderBy,
    currentPage,
    rowsPerPage
  ])

  // checks and disable pooling when it's no longer needed
  useEffect(() => {
    if (repoPageList.status !== SUCCEED) {
      return
    }

    // if no repository is processing
    const hasUnderway = repoPageList.data.some(
      (repository) => repository.status === Readiness.UNDERWAY
    )
    if (!hasUnderway) {
      window.clearInterval(poolingInterval.current)
      poolingInterval.current = null
      return
    }

    if (hasUnderway && poolingInterval.current === null) {
      setPooling()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPooling, repoPageList, dispatch])

  useEffect(() => {
    if (repoPageList.totalRecords > 0 && alreadyTracked.current === false) {
      MP.track(RepositoryEvents.LIST_ALL, {
        'Repositories List': repoPageList.data ? repoPageList.data.map(({ gitUrl }) => gitUrl) : [],
        'Total Repositories': repoPageList.totalRecords ?? 0
      })
      alreadyTracked.current = true
    }
  }, [repoPageList.data, repoPageList.totalRecords])

  const onChangePage = (_event, page) => {
    setCurrentPage(page)
  }
  const onChangeRowsPerPage = ({ target }) => {
    setCurrentPage(0)
    setRowsPerPage(target.value)
  }
  const reloadRepositoryList = () => {
    dispatch({ type: FETCH_LIST })
  }

  const handleCloseRepositoryDialog = (success) => {
    if (success) {
      reloadRepositoryList()
    }

    setRepositoryDialog(false)
  }

  const handleOpenRepositoryDialog = () => {
    setRepositoryDialog(true)
  }

  const handleRepositoryCheck = ({ target }, checkedRepositoryGitUrl) => {
    const checked = target.checked
    const repositoriesWithoutCurrent = repositoriesToDelete.filter(
      (gitUrl) => gitUrl !== checkedRepositoryGitUrl
    )

    if (!checked) {
      setRepositoriesToDelete(repositoriesWithoutCurrent)
      return
    }

    setRepositoriesToDelete([
      ...repositoriesWithoutCurrent,
      checkedRepositoryGitUrl
    ])
  }

  const handleDeleteRepositories = () => {
    if (!repositoriesToDelete.length) return

    setDeleteRepositoriesDialogOpen(true)
  }

  const closeDeleteRepositoriesDialog = () => {
    setDeleteRepositoriesDialogOpen(false)
  }

  const repositories = repoPageList.status === SUCCEED
    ? (
        repoPageList.data.map((repository) => {
          return {
            ...repository,
            commit_message: repository?.latest_report?.commit_message,
            commit_timestamp: repository?.latest_report?.commit_timestamp,
          }
        })
      )
    : []

  const deleteSuccessful = () => {
    MP.track(RepositoryEvents.DELETE_REPO, {
      deleted: repositoriesToDelete.length,
      repositories: repositoriesToDelete
    })
    setRepositoriesToDelete([])
  }

  const handleSelectAll = ({ target }) => {
    const isChecked = target.checked

    if (isChecked) {
      setRepositoriesToDelete(repositories.map(({ gitUrl }) => gitUrl))
    } else {
      setRepositoriesToDelete([])
    }
  }

  const renderSelectAll = () => {
    return (
      <StyledSelectAll>
        <Checkbox
          color='primary'
          onChange={handleSelectAll}
          size={isLgUp ? 'medium' : 'small'}
          className={classes.selectAllCheckbox}
        />
      </StyledSelectAll>
    )
  }

  const tableCells = [
    {
      id: 'name',
      label: 'Repository',
      formatter: (value, row) => {
        const repositoryLink = (
          isNextGenEnabled()
            ? `my-contributions/progress?gitUrl=${row.gitUrl}`
            : `repository/overview?gitUrl=${row.gitUrl}`
        )
        return (
          <Link
            color='secondary'
            component={RouterLink}
            to={repositoryLink}
            title={value}
            className={classes.repoName}
          >
            {ellipsis(value)}
          </Link>
        )
      }
    },
    {
      breakpoint: isLgUp,
      id: 'commitTimestamp',
      label: 'Last Processed Commit',
      formatter: (value, row) => {
        return (
          <>
            {row?.commitTitle}<br />
            {value ? (DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT)) : ' - '}
          </>
        )
      }
    },
    {
      id: 'status',
      label: 'Status',
      width: '240px',
      formatter: (status, row) => (
        <RepositoryStatus
          status={status}
          progress={row.progress}
          errorMessage={row?.errorMessage}
        />
      )
    },
    {
      breakpoint: isSmUp,
      id: 'button',
      label: renderSelectAll,
      formatter: (_, row) => {
        return (
          <>
            <RepositoryListActions
              repository={row}
              list={repoPageList}
              repositoriesToDelete={repositoriesToDelete}
              handleRepositoryCheck={handleRepositoryCheck}
            />
          </>
        )
      }
    }
  ]

  return (
    <>
      {!isSmUp && (
        <Typography variant='h1'>
          <Trans>Repositories</Trans>
        </Typography>
      )}
      <StyledButtonContainer>
        <Button
          color='primary'
          variant='contained'
          onClick={handleOpenRepositoryDialog}
        >
          <Trans>Add New</Trans>
        </Button>
        {isSmUp && (
          <Button
            color='primary'
            variant='outlined'
            onClick={handleDeleteRepositories}
            disabled={!repositoriesToDelete.length}
            className={classes.buttonOutlinedPrimary}
          >
            <Trans>Delete</Trans>
          </Button>
        )}
      </StyledButtonContainer>
      <Suspense fallback={<PageLoading />}>
        {(Array.isArray(repoPageList.data))
          ? (
            <AdvancedTable
              heading={tableCells}
              data={repoPageList.data}
              order={order}
              setOrder={setOrder}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
              sticky={false}
              id='url'
              total={repoPageList.totalRecords ?? 0}
              emptyMessage={(
                <Trans>
                  There is nothing to see here. Try adding a repository to see its analysis.
                </Trans>
              )}
            />
            )
          : <FetchStatus status={repoPageList.status} />}
        <AddRepositoryDialog
          open={repositoryDialog}
          handleClose={handleCloseRepositoryDialog}
          currentRepositories={list}
        />
      </Suspense>
      <DeleteRepositoriesDialog
        open={deleteRepositoriesDialogOpen}
        handleClose={closeDeleteRepositoriesDialog}
        repositories={repositoriesToDelete}
        onSuccess={deleteSuccessful}
      />
    </>
  )
}

export default function BoundedRepositories () {
  return (
    <>
      <Helmet>
        <title>Repositories - Merico Build</title>
      </Helmet>
      <ClassNames>
        {({ css }) => (
          <Panel ContentClassname={css`
          padding: 30px 23px;
          ${mdMedia('padding: 40px 50px;')}
        `}
          >
            <ErrorBoundary>
              <Repositories />
            </ErrorBoundary>
          </Panel>
        )}
      </ClassNames>
    </>
  )
}
