import { getCommitUrlByGitUrlAndHash } from './commit'

const hash = '2db770afd5ede91663b9b416d8e05f33affb454e'

describe('Commit', () => {
  it('returns null when no param was given', () => {
    expect(getCommitUrlByGitUrlAndHash()).toBe(null)
  })
  it('returns null when hash is falsy', () => {
    expect(getCommitUrlByGitUrlAndHash('example', null)).toBe(null)
    expect(getCommitUrlByGitUrlAndHash('example', '')).toBe(null)
    expect(getCommitUrlByGitUrlAndHash('example')).toBe(null)
    expect(getCommitUrlByGitUrlAndHash('example', false)).toBe(null)
  })
  describe('when given a hash', () => {
    it('returns null when git url is falsy', () => {
      expect(getCommitUrlByGitUrlAndHash(null, hash)).toBe(null)
      expect(getCommitUrlByGitUrlAndHash('', hash)).toBe(null)
      expect(getCommitUrlByGitUrlAndHash(undefined, hash)).toBe(null)
      expect(getCommitUrlByGitUrlAndHash(false, hash)).toBe(null)
    })
  })
  describe('when using github', () => {
    const expectedGitUrl = `https://github.com/mericoqa2/special-octo-sniffle/commit/${hash}`
    it('works with https url without .git', () => {
      const gitUrl = 'https://github.com/mericoqa2/special-octo-sniffle'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
    it('works with https url with .git', () => {
      const gitUrl = 'https://github.com/mericoqa2/special-octo-sniffle.git'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
    it('works with http url without .git', () => {
      const gitUrl = 'http://github.com/mericoqa2/special-octo-sniffle'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
    it('works with http url with .git', () => {
      const gitUrl = 'http://github.com/mericoqa2/special-octo-sniffle.git'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
    it('works with git@ protocol', () => {
      const gitUrl = 'git@github.com:mericoqa2/special-octo-sniffle.git'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
    it('works with git:// protocol', () => {
      const gitUrl = 'git://github.com:mericoqa2/special-octo-sniffle.git'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
  })
  describe('when using gitlab', () => {
    it('works with without .git', () => {
      const expectedGitUrl = `https://gitlab.com/merico-dev/ce-frontend/commit/${hash}`
      const gitUrl = 'https://gitlab.com/merico-dev/ce-frontend'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
    it('works with with .git', () => {
      const expectedGitUrl = `https://gitlab.com/merico-dev/ce-frontend/commit/${hash}`
      const gitUrl = 'https://gitlab.com/merico-dev/ce-frontend.git'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
    it('works with git@ protocol', () => {
      const expectedGitUrl = `https://gitlab.com/merico-dev/ce-frontend/commit/${hash}`
      const gitUrl = 'git@gitlab.com:merico-dev/ce-frontend.git'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
    it('works with git:// protocol', () => {
      const expectedGitUrl = `https://gitlab.com/merico-dev/ce-frontend/commit/${hash}`
      const gitUrl = 'git://gitlab.com:merico-dev/ce-frontend.git'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
    it('works with git protocol in group', () => {
      const expectedGitUrl = `https://gitlab.com/merico-dev/ce/ce-frontend/commit/${hash}`
      const gitUrl = 'git@gitlab.com:merico-dev/ce/ce-frontend.git'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
    it('works with with a group', () => {
      const expectedGitUrl = `https://gitlab.com/merico-dev/ce/ce-frontend/commit/${hash}`
      const gitUrl = 'https://gitlab.com/merico-dev/ce/ce-frontend.git'
      expect(getCommitUrlByGitUrlAndHash(gitUrl, hash)).toBe(expectedGitUrl)
    })
  })
})
