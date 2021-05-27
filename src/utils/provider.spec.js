import { diffRepositoriesByUpdatedDate } from './provider'

function providerRepoDateFactory (lastUpdated = '2021-01-01T01:00:00Z') {
  const rand = Math.random()
  return {
    alreadyAdded: false,
    gitUrl: `git://github.com/LucasKauz/todo-app-vue-ts-${rand}.git`,
    language: 'Vue',
    name: `todo-app-vue-ts-${rand}`,
    url: `https://api.github.com/repos/LucasKauz/todo-app-vue-ts-${rand}`,
    lastUpdated
  }
}

describe('provider', () => {
  describe('diffRepositoriesByUpdatedDate', () => {
    it('returns 0 when repo_a or repo b are not defined', () => {
      expect(diffRepositoriesByUpdatedDate()).toBe(0)
      expect(diffRepositoriesByUpdatedDate(providerRepoDateFactory())).toBe(0)
      expect(diffRepositoriesByUpdatedDate(undefined, providerRepoDateFactory())).toBe(0)
    })
    it('returns 0 when repo_a or repo b have an invalid date', () => {
      const invalid_repo = diffRepositoriesByUpdatedDate('INVALID EXAMPLE')
      const invalid_date_repo = diffRepositoriesByUpdatedDate('INVALID EXAMPLE')
      const valid_repo = diffRepositoriesByUpdatedDate()
      expect(diffRepositoriesByUpdatedDate(invalid_repo)).toBe(0)
      expect(diffRepositoriesByUpdatedDate(invalid_date_repo, valid_repo)).toBe(0)
      expect(diffRepositoriesByUpdatedDate(valid_repo, invalid_date_repo)).toBe(0)
      expect(diffRepositoriesByUpdatedDate(invalid_date_repo, invalid_date_repo)).toBe(0)
    })
    it('returns 0 when repo_a and repo b have the same date', () => {
      expect(diffRepositoriesByUpdatedDate(
        providerRepoDateFactory(),
        providerRepoDateFactory()
      )).toBe(0)
    })
    it('returns the difference in milliseconds between repo_a and repo b', () => {
      expect(
        diffRepositoriesByUpdatedDate(
          providerRepoDateFactory('2021-01-01T01:00:00Z'),
          providerRepoDateFactory('2022-01-01T01:00:00Z')
        )
      ).toBe(31536000000)
    })
    it('returns a positive number when repo_a was updated later than repo b', () => {
      expect(
        diffRepositoriesByUpdatedDate(
          providerRepoDateFactory('2021-01-01T01:00:00Z'),
          providerRepoDateFactory('2022-01-01T01:00:00Z')
        )
      ).toBeGreaterThan(1)
    })
    it('returns a negative number when repo_a was updated earlier than repo b', () => {
      expect(
        diffRepositoriesByUpdatedDate(
          providerRepoDateFactory('2022-01-01T01:00:00Z'),
          providerRepoDateFactory('2021-01-01T01:00:00Z')
        )
      ).toBeLessThan(1)
    })
  })
})
