import { DateTime } from 'luxon'
import { getColorGenerator } from 'charts'
import { useSelector } from 'react-redux'

import { colorSet } from '@/enums/colors'
import { Readiness } from '@/enums/repositoryReadiness'

export function useTotalCommits (gitUrls = []) {
  const {
    list
  } = useSelector((state) => state.repositories)

  if (!Array.isArray(list?.data)) {
    return 0
  }

  const repositories = !gitUrls.length
    ? list?.data
    : list?.data.filter(({ gitUrl }) => gitUrls.includes(gitUrl))

  return repositories.reduce((acc, cur) => {
    const commitCount = cur?.userCommitCount || 0
    return acc + commitCount
  }, 0)
}

export function themeRepositories (repositories) {
  const colors = getColorGenerator(null, colorSet)

  return repositories.map((repository) => {
    return {
      ...repository,
      color: colors.next().value
    }
  })
}

export function getDefaultFavoriteRepositories (repositories) {
  if (!repositories?.length) {
    return []
  }

  let selected = repositories.filter(({ isFavorite }) => isFavorite)

  if (!selected.length) {
    selected = [...repositories].sort((a, b) => {
      const dateA = DateTime.fromISO(a.lastSyncTime)
      const dateB = DateTime.fromISO(b.lastSyncTime)
      const orderedList = dateB.diff(dateA)
      return orderedList
    }).slice(0, 6)
  }

  const filteredFavorites = selected.filter(({ status, latestCommitHash }) => {
    return (
      status === Readiness.READY ||
      (status === Readiness.UNDERWAY && latestCommitHash)
    )
  })

  return themeRepositories(filteredFavorites)
}
