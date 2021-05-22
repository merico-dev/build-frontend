import { getUserAlias, getServiceProvider, defaultAlias } from './user'

const DISPLAY_NAME = 'Display Name'
const GITHUB_USERNAME = 'GithubUsername'
const GITLAB_USERNAME = 'GitlabUsername'
const FIRST_EMAIL_LIST = 'firstfromlist@example.com'
const CONSOLIDATED_USERNAME = 'consolidated-username'
const PREPEND = '__PREPEND__'

function userDataFactory (userData) {
  return {
    id: 1,
    photo: 'https://avatars.githubusercontent.com/u/1552681?v=4',
    displayName: DISPLAY_NAME,
    gitlabUsername: GITLAB_USERNAME,
    githubUsername: GITHUB_USERNAME,
    githubApiUrl: 'https://api.github.com/users/GithubUsername',
    website: null,
    isOnboarded: true,
    isPublic: true,
    primaryEmail: 'exampleemail@gmail.com',
    createdAt: '2021-01-22T04:23:14.303Z',
    updatedAt: '2021-03-05T19:34:50.714Z',
    username: CONSOLIDATED_USERNAME,
    UserEmails: [
      {
        id: 1,
        email: 'exampleemail2@gmail.com',
        isVerified: true,
        UserId: 1,
        createdAt: '2021-01-22T04:23:14.777Z',
        updatedAt: '2021-01-22T04:23:14.777Z'
      },
      {
        id: 2,
        email: 'secondary.email@gmail.com',
        isVerified: false,
        UserId: 1,
        createdAt: '2021-01-22T04:23:14.777Z',
        updatedAt: '2021-01-22T04:23:14.777Z'
      }
    ],
    emails: [
      FIRST_EMAIL_LIST,
      'secondary.email@outlook.com'
    ],
    ...userData
  }
}

describe('user util', () => {
  describe('getUserAlias', () => {
    it('returns the defaultAlias string when userData has the incorrect format', () => {
      expect(getUserAlias()).toBe(defaultAlias)
      expect(getUserAlias(null)).toBe(defaultAlias)
      expect(getUserAlias(false)).toBe(defaultAlias)
      expect(getUserAlias({})).toBe(defaultAlias)
      expect(getUserAlias('WRONG DATA')).toBe(defaultAlias)
      expect(getUserAlias({ emails: null })).toBe(defaultAlias)
      expect(getUserAlias({ emails: [{ content: 'lucas@example.com' }] })).toBe(defaultAlias)
    })

    it('returns the defaultAlias when all identifiers are empty', () => {
      expect(
        getUserAlias(userDataFactory({
          displayName: '',
          gitlabUsername: '',
          githubUsername: '',
          primaryEmail: '',
          emails: [],
          username: ''
        }))
      ).toBe(defaultAlias)
    })

    it('skips the displayName when it\'s disabled', () => {
      expect(
        getUserAlias(userDataFactory(), '', true)
      ).toBe(GITHUB_USERNAME)
    })

    it('returns the github username when github and gitlab are both present but displayName isn\'t', () => {
      expect(
        getUserAlias(userDataFactory({ displayName: '' }))
      ).toBe(GITHUB_USERNAME)
    })

    it('returns the gitlab username when user has no displayName or githubUsername', () => {
      expect(
        getUserAlias(userDataFactory({
          displayName: '',
          githubUsername: null
        }))
      ).toBe(GITLAB_USERNAME)
    })

    it('returns the the consolidated username when all other identifiers are missing', () => {
      expect(
        getUserAlias(userDataFactory({
          displayName: '',
          githubUsername: null,
          gitlabUsername: null
        }))
      ).toBe(CONSOLIDATED_USERNAME)
    })

    it('returns the username with the prepended string', () => {
      expect(
        getUserAlias(userDataFactory({
          displayName: null,
          githubUsername: null
        }), PREPEND)
      ).toBe(`${PREPEND}${GITLAB_USERNAME}`)
    })
  })

  describe('getServiceProvider', () => {
    it('returns github if the user has the wrong format', () => {
      expect(getServiceProvider()).toBe('github')
      expect(getServiceProvider(null)).toBe('github')
      expect(getServiceProvider(false)).toBe('github')
      expect(getServiceProvider({})).toBe('github')
      expect(getServiceProvider('WRONG DATA')).toBe('github')
    })

    it('returns github if the user has gitlab and github connection', () => {
      expect(
        getServiceProvider(userDataFactory())
      ).toBe('github')
    })

    it('returns github if the user has only the github connection', () => {
      expect(
        getServiceProvider(userDataFactory({
          gitlabUsername: null
        }))
      ).toBe('github')
    })

    it('returns gitlab if the user has only the gitlab connection', () => {
      expect(getServiceProvider(userDataFactory({
        githubUsername: null
      }))).toBe('gitlab')
    })
  })
})
