import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import queryString from 'query-string'

import { FETCH_LIST } from '@/store/reducers/repositories'
import { LOADING } from '@/store/statusTypes'
import { getOptionsFromArray } from '@/utils/select/select'

/**
 * DEPRECATED: This hooks was deprecated please use /src/hooks/useRepositories
 */
export default function useRepositories (props = {}) {
  const {
    setRepository = null
  } = props
  const [selectedRepositoryObject, setSelectedRepositoryObject] = useState({})
  const dispatch = useDispatch()
  const {
    repositories: {
      list
    }
  } = useSelector((state) => state)
  const { gitUrl } = queryString.parse(window.location.search)

  useEffect(() => {
    if (list.status === LOADING || !setRepository) {
      return
    }

    // check for query string repo
    if (gitUrl) {
      const repositoryObject = list.data.filter(
        (repository) => repository.gitUrl === gitUrl
      )
      setRepository(
        getOptionsFromArray(repositoryObject, 'gitUrl', 'name')?.[0] ?? null
      )
      setSelectedRepositoryObject(repositoryObject?.[0])

      return
    }

    // check localStorage saved selected repository
    try {
      const localStorageSelectedRepository = JSON.parse(localStorage?.getItem('selectedRepository'))
      if (localStorageSelectedRepository) {
        const selectedRepository = list?.data.filter(
          (repository) => repository.gitUrl === localStorageSelectedRepository.value
        )
        if (selectedRepository.length) {
          setRepository(
            getOptionsFromArray(selectedRepository, 'gitUrl', 'name')?.[0]
          )
          setSelectedRepositoryObject(selectedRepository?.[0])
          return
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('incorrect saved repository, cleaning')
      localStorage.removeItem('selectedRepository')
    }

    // set selected repository the first on the list
    setRepository(
      getOptionsFromArray(list?.data, 'gitUrl', 'name')?.[0] ?? null
    )
    setSelectedRepositoryObject(list?.data?.[0] || {})
  }, [list, gitUrl, setRepository])

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

  return {
    list,
    selectedRepositoryObject
  }
}
