import { Readiness } from '@/enums/repositoryReadiness'
import { DateTime } from 'luxon'
import { getDefaultFavoriteRepositories } from './repositories'

jest.mock('charts', () => {
  return {
    getColorGenerator: () => {
      return {
        next: () => {
          return { value: 'mocked' }
        }
      }
    }
  }
})

function repositoryFactory (override) {
  return {
    name: `Repository ${Math.random()}`,
    lastSyncTime: DateTime.local().toISO(),
    latestCommitHash: '1234546489',
    status: Readiness.READY,
    isFavorite: true,
    ...override
  }
}

describe('repositories', () => {
  describe('getDefaultFavoriteRepositories', () => {
    it('returns an empty array when an empty array was given', () => {
      expect(
        getDefaultFavoriteRepositories([])
      ).toStrictEqual([])
    })
    it('returns an empty array when nothing was given', () => {
      expect(
        getDefaultFavoriteRepositories()
      ).toStrictEqual([])
    })
    it('returns an empty array when repositories failed', () => {
      const repositories = [
        repositoryFactory({ name: 'is favorite but failed', status: Readiness.FAILURE }),
      ]
      expect(
        getDefaultFavoriteRepositories(repositories)
      ).toStrictEqual([])
    })
    it('returns an empty array when repositories are underway without a commit hash', () => {
      const repositories = [
        repositoryFactory({ latestCommitHash: '', status: Readiness.UNDERWAY }),
        repositoryFactory({ latestCommitHash: null, status: Readiness.UNDERWAY }),
      ]
      expect(
        getDefaultFavoriteRepositories(repositories)
      ).toStrictEqual([])
    })
    it('returns favorite repositories that are underway and have a commit hash', () => {
      const repositories = [
        repositoryFactory({
          name: 'is favorite, underway and have a commit hash',
          latestCommitHash: 'ABC',
          status: Readiness.UNDERWAY
        }),
        repositoryFactory({ name: 'isn\'t not favorite', isFavorite: false }),
      ]
      expect(
        getDefaultFavoriteRepositories(repositories)
      ).toStrictEqual([
        {
          ...repositories[0],
          color: 'mocked'
        }
      ])
    })
    it('returns favorite repositories that have the status set as ready', () => {
      const repositories = [
        repositoryFactory({ isFavorite: false }),
        repositoryFactory({ name: 'is favorite and is ready' }),
      ]
      expect(
        getDefaultFavoriteRepositories(repositories)
      ).toStrictEqual([
        {
          ...repositories[1],
          color: 'mocked'
        }
      ])
    })
  })
})
