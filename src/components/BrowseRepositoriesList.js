import React, { useState, useMemo, useEffect, useCallback } from 'react'
import styled from '@emotion/styled'
import {
  TextField,
  Checkbox,
  makeStyles
} from '@material-ui/core'
import { css } from '@emotion/core'

import { MAX_REPOSITORIES_PER_SELECTION } from '@/enums/repositories'
import { FETCH_GITHUB_REPOS, FETCH_GITLAB_REPOS } from '@/store/reducers/repositories'
import { useDispatch, useSelector } from 'react-redux'
import { LOADING, SUCCEED } from '@/store/statusTypes'
import FetchStatus from '@/components/FetchStatus'

import StyledRepositoryList from '@/components/StyledRepositoryList'
import { diffRepositoriesByUpdatedDate } from '@/utils/provider'

const StyledLabel = styled.label`
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  ${({ disabledRepository }) => disabledRepository && (css`
    color: var(--color-gray-300);
  `)}
`

const useStyles = makeStyles({
  checkbox: {
    '&.Mui-disabled': {
      color: 'var(--color-primary-400)'
    }
  }
})

function FilteredRepositoriesList (props) {
  const {
    status,
    filteredRepositories,
    handleRepositoryCheck,
    checkedRepositories,
    maxRepositories,
    currentRepositories
  } = props

  const classes = useStyles()

  if (currentRepositories && currentRepositories.status === LOADING) {
    return <FetchStatus status={currentRepositories.status} />
  }
  if (status !== SUCCEED) {
    return <FetchStatus status={status} />
  }

  if (!filteredRepositories.length) {
    return 'No repositories found.'
  }

  return filteredRepositories.map((repository, index) => {
    const checked = checkedRepositories?.includes(repository)
    const wasAlreadyAdded = repository.alreadyAdded
    const disabledStyle = (maxRepositories && !checked) || wasAlreadyAdded
    return (
      <StyledLabel
        // eslint-disable-next-line react/no-array-index-key
        key={`${repository.url}${index}`}
        disabledRepository={disabledStyle}
      >
        <Checkbox
          onChange={(e) => !wasAlreadyAdded && handleRepositoryCheck(e, repository)}
          value={repository}
          color='primary'
          checked={checked}
          data-test='browse-repository-check'
          disabled={wasAlreadyAdded}
          className={classes.checkbox}
        />
        {repository.name}
      </StyledLabel>
    )
  })
}

export default function BrowseRepositoriesList (props) {
  const {
    service,
    preSelected,
    handleAddRepositories,
    handleSelectedRepositories,
    currentRepositories,
    externalRepoCount = 0,
    inDialog = false,
    selectTop = false
  } = props
  const {
    githubRepos,
    gitlabRepos
  } = useSelector((state) => {
    return state.repositories
  })
  const dataSource = (service === 'github') ? githubRepos : gitlabRepos
  const [repositorySearch, setRepositorySearch] = useState('')
  const [checkedRepositories, setCheckedRepositories] = useState([])
  const [repositories, setRepositories] = useState([])
  const [selectedForImport, setSelectedForImport] = useState([])
  const [maxRepositories, setMaxRepositories] = useState(false)
  const dispatch = useDispatch()

  const handleRepositorySearch = ({ target }) => {
    setRepositorySearch(target.value)
  }

  useEffect(() => {
    if (checkedRepositories?.length >= MAX_REPOSITORIES_PER_SELECTION ||
      (externalRepoCount + checkedRepositories?.length) >= MAX_REPOSITORIES_PER_SELECTION) {
      setMaxRepositories(true)
      return
    }

    setMaxRepositories(false)
  }, [setMaxRepositories, checkedRepositories, externalRepoCount])

  const filteredRepositories = useMemo(() => {
    let searchExpression = null
    try {
      searchExpression = repositorySearch.length ? new RegExp(repositorySearch, 'gi') : null
    } catch (e) {
      // no-matches
    }
    return repositorySearch.length
      ? (
          repositories.filter(
            (repository) => (repository.name.match(searchExpression) !== null)
          )
        )
      : repositories
  }, [repositories, repositorySearch])

  const handleRepositoryCheck = useCallback(({ target }, changedRepository) => {
    const { checked } = target
    if (checked) {
      setCheckedRepositories((repositories) => {
        if (repositories.length >= MAX_REPOSITORIES_PER_SELECTION) return repositories

        if (repositories.find((repository) => repository.url === changedRepository.url)) {
          return repositories
        }
        return [...repositories, changedRepository]
      })
      return
    }
    setCheckedRepositories((repositories) => {
      return repositories.filter((repository) => repository.url !== changedRepository.url)
    })
  }, [setCheckedRepositories])

  useEffect(() => {
    setRepositories(dataSource?.data?.sort(diffRepositoriesByUpdatedDate) || [])
  }, [dataSource])

  useEffect(() => {
    dispatch({
      type: (service === 'github') ? FETCH_GITHUB_REPOS : FETCH_GITLAB_REPOS
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (preSelected.length > 0) {
      const filteredPreSelected = repositories.filter((currentRepository) => {
        return preSelected?.some(
          (preSelectedRepository) => preSelectedRepository.url === currentRepository.url
        )
      })
      setCheckedRepositories(filteredPreSelected)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repositories, setCheckedRepositories])

  useEffect(() => {
    if (selectTop) {
      // select top repositories and
      // remove the ones already added
      const maxReposMinusDefault = MAX_REPOSITORIES_PER_SELECTION - 1

      const filteredTopRepos = repositories
        .slice(0, maxReposMinusDefault)
        .filter(({ alreadyAdded = false }) => !alreadyAdded)
      setCheckedRepositories(filteredTopRepos)
    }
  }, [repositories, selectTop, setCheckedRepositories])

  useEffect(() => {
    if (inDialog) {
      handleSelectedRepositories(checkedRepositories)
    } else {
      handleAddRepositories(checkedRepositories, service)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedRepositories])

  useEffect(() => {
    setSelectedForImport(preSelected)
  }, [preSelected])

  return (
    <>
      <TextField
        label='Find a repository'
        id='RepositorySearch'
        value={repositorySearch}
        onChange={handleRepositorySearch}
        fullWidth
      />
      <StyledRepositoryList
        outsideSpace='500px'
        marginTop='20px'
        className={inDialog ? '' : 'embedded'}
        data-test='browse-repository-list_list'
      >
        <FilteredRepositoriesList
          status={dataSource.status}
          filteredRepositories={filteredRepositories}
          handleRepositoryCheck={handleRepositoryCheck}
          checkedRepositories={checkedRepositories}
          maxRepositories={maxRepositories}
          currentRepositories={currentRepositories}
          preSelected={selectedForImport}
        />
      </StyledRepositoryList>
    </>
  )
}
