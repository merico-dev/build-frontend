import providers from '@/enums/providers'
import {
  getHostUrlByProjectUrl,
  getCommitUrlByProjectUrlAndHash,
  getProviderByProjectUrl,
  getUserByProjectUrl
} from './projectUrl'

const GITLAB_PROJECT_URL = 'https://gitlab.com/merico-dev/ce-frontend'
const GITLAB_HOST_URL = GITLAB_PROJECT_URL
const GITHUB_PROJECT_URL = 'https://github.com/basicthinker/Sestet'
const GITHUB_HOST_URL = 'https://github.com/basicthinker/Sestet'
const HASH = '2db770afd5ede91663b9b416d8e05f33affb454e'

describe('projectUrl', () => {
  describe('getHostUrlByProjectUrl', () => {
    it('returns null when no param was given', () => {
      expect(getHostUrlByProjectUrl()).toBe(null)
    })
    it('returns null when url is empty', () => {
      expect(getHostUrlByProjectUrl('')).toBe(null)
    })
    it('returns correct host url when using GitHub', () => {
      expect(getHostUrlByProjectUrl(GITHUB_PROJECT_URL)).toBe(GITHUB_HOST_URL)
    })
    it('returns correct host url when using GitLab', () => {
      expect(getHostUrlByProjectUrl(GITLAB_PROJECT_URL)).toBe(GITLAB_HOST_URL)
    })
  })

  describe('getProviderByProjectUrl', () => {
    it('returns null when no param was given', () => {
      expect(getProviderByProjectUrl()).toBe(null)
    })
    it('returns null when url is empty', () => {
      expect(getProviderByProjectUrl('')).toBe(null)
      expect(getProviderByProjectUrl(null)).toBe(null)
      expect(getProviderByProjectUrl(false)).toBe(null)
    })
    it('returns GitHub when project url is from GitHub', () => {
      expect(getProviderByProjectUrl(GITHUB_PROJECT_URL)).toBe(providers.GITHUB)
    })
    it('returns GitLab when project url is from GitLab', () => {
      expect(getProviderByProjectUrl(GITLAB_PROJECT_URL)).toBe(providers.GITLAB)
    })
  })

  describe('getCommitUrlByProjectUrlAndHash', () => {
    it('returns null when no param was given', () => {
      expect(getCommitUrlByProjectUrlAndHash()).toBe(null)
    })
    it('returns null when url or hash are empty', () => {
      expect(getCommitUrlByProjectUrlAndHash('', HASH)).toBe(null)
      expect(getCommitUrlByProjectUrlAndHash(false, HASH)).toBe(null)
      expect(getCommitUrlByProjectUrlAndHash(null, HASH)).toBe(null)
      expect(getCommitUrlByProjectUrlAndHash(GITLAB_PROJECT_URL)).toBe(null)
      expect(getCommitUrlByProjectUrlAndHash(GITLAB_PROJECT_URL, '')).toBe(null)
      expect(getCommitUrlByProjectUrlAndHash(GITLAB_PROJECT_URL, false)).toBe(null)
      expect(getCommitUrlByProjectUrlAndHash(GITLAB_PROJECT_URL, null)).toBe(null)
    })
    it('returns correct host url when using GitHub', () => {
      expect(
        getCommitUrlByProjectUrlAndHash(GITHUB_PROJECT_URL, HASH)
      ).toBe(`${GITHUB_HOST_URL}/commit/${HASH}`)
    })
    it('returns correct host url when using GitHub', () => {
      expect(
        getCommitUrlByProjectUrlAndHash(GITLAB_PROJECT_URL, HASH)
      ).toBe(`${GITLAB_PROJECT_URL}/commit/${HASH}`)
    })
  })

  describe('getUserByProjectUrl', () => {
    it('returns not found user when url has the wrong format', () => {
      const userNotFound = {
        user: 'Not Found',
        url: '#'
      }
      expect(getUserByProjectUrl(null)).toStrictEqual(userNotFound)
      expect(getUserByProjectUrl('')).toStrictEqual(userNotFound)
      expect(getUserByProjectUrl([])).toStrictEqual(userNotFound)
    })

    it('returns GitLab user url when found', () => {
      const user = getUserByProjectUrl(
        'https://gitlab.com/lucas.rosa.merico/test-gitlab'
      )
      expect(user).toStrictEqual({
        user: 'lucas.rosa.merico',
        url: 'https://gitlab.com/lucas.rosa.merico'
      })
    })

    it('returns GitLab user with group url when found', () => {
      const user = getUserByProjectUrl(
        'https://gitlab.com/merico-dev/ce/ce-frontend'
      )
      expect(user).toStrictEqual({
        user: 'merico-dev/ce',
        url: 'https://gitlab.com/merico-dev/ce'
      })
    })

    it('returns GitHub user url when found', () => {
      const user = getUserByProjectUrl(
        'https://github.com/LucasKauz/how-to-console-log-things'
      )
      expect(user).toStrictEqual({
        user: 'LucasKauz',
        url: 'https://github.com/LucasKauz'
      })
    })
  })
})
