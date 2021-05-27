import { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import queryString from 'query-string'

import { FETCH_LIST } from '@/store/reducers/repositories'
import { LOADING } from '@/store/statusTypes'
// import { getOptionsFromArray } from '@/utils/select/select'

function repositoryAsOption ({ name, gitUrl }) {
  return {
    label: name,
    value: gitUrl
  }
}

function getSingleRepoFromLocalStorage (listData) {
  const localStorageSelectedRepository = JSON.parse(localStorage?.getItem('selectedRepository'))
  if (localStorageSelectedRepository) {
    const selectedRepository = listData.find(
      (repository) => repository.gitUrl === localStorageSelectedRepository.value
    )
    if (selectedRepository) {
      return repositoryAsOption(selectedRepository)
    }
  }
}

function getMultipleReposFromLocalStorage (listData) {
  const localStorageSelectedRepositories = JSON.parse(localStorage?.getItem('selectedMultipleRepositories'))

  const options = localStorageSelectedRepositories?.map((localStorageSelectedRepository) => {
    const selectedRepository = listData.find(
      (repository) => repository.gitUrl === localStorageSelectedRepository.value
    )
    if (selectedRepository) {
      return repositoryAsOption(selectedRepository)
    }
    return null
  }) || []

  return options.filter(Boolean)
}

export default function useRepositories (props = {}) {
  const {
    multiRepos = false
  } = props
  const [repository, setRepository] = useState()
  const dispatch = useDispatch()
  const {
    repositories: {
      list
    }
  } = useSelector((state) => state)
  const { gitUrl } = queryString.parse(window.location.search)

  const setRepoByGitUrl = useCallback(() => {
    const repositoryObject = list.data.find(
      (repository) => repository.gitUrl === gitUrl
    )

    if (multiRepos) {
      setRepository([repositoryAsOption(repositoryObject)])
      return
    }

    setRepository(repositoryAsOption(repositoryObject))
  }, [gitUrl, list.data, multiRepos])

  const setRepoByLocalStorage = useCallback(() => {
    const listData = list?.data || []
    const selected = (multiRepos) ? getMultipleReposFromLocalStorage(listData) : getSingleRepoFromLocalStorage(listData)

    if ((!multiRepos && selected) || selected?.length) {
      setRepository(selected)
      return true
    }

    return false
  }, [list?.data, multiRepos])

  const setFirstRepoFromList = useCallback(() => {
    const firstFromList = list?.data?.[0]

    if (multiRepos) {
      setRepository(firstFromList ? [repositoryAsOption(firstFromList)] : [])
      return
    }

    setRepository(firstFromList ? repositoryAsOption(firstFromList) : {})
  }, [list.data, multiRepos])

  useEffect(() => {
    if (list.status === LOADING || !setRepository) {
      return
    }

    // check for query string repo
    if (gitUrl) {
      return setRepoByGitUrl()
    }

    // check localStorage saved selected repository
    try {
      const repoWasSet = setRepoByLocalStorage()
      if (repoWasSet) {
        return
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('incorrect saved repository, cleaning')
      localStorage.removeItem('selectedRepository')
    }

    setFirstRepoFromList()
  }, [
    list,
    gitUrl,
    setRepository,
    multiRepos,
    setRepoByGitUrl,
    setRepoByLocalStorage,
    setFirstRepoFromList
  ])

  useEffect(() => {
    // only fetch repositories if none was found
    if (!list?.data?.length) {
      dispatch({
        type: FETCH_LIST,
        payload: {
          sortColumn: 'name',
          sortDirection: 'asc'
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (localStorage && (repository?.value?.length || repository?.length)) {
      try {
        if (multiRepos) {
          localStorage.setItem('selectedMultipleRepositories', JSON.stringify(repository))
        } else {
          localStorage.setItem('selectedRepository', JSON.stringify(repository))
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Unable to save repository', e, repository)
      }
    }
  }, [multiRepos, repository])

  return {
    list,
    // selectedRepositoryObject,
    repository,
    setRepository
  }
}
