import { getLinguistBadgeRank } from './linguist'

describe('linguist', () => {
  describe('getLinguistBadgeRank', () => {
    it('returns 99% when ELOC is 0', () => {
      const eloc = 0
      const rank = getLinguistBadgeRank(eloc, 'JavaScript')
      expect(rank).toBe(99)
    })

    it('returns 99% when ELOC is a falsy value', () => {
      const eloc = undefined
      const rank = getLinguistBadgeRank(eloc, 'JavaScript')
      expect(rank).toBe(99)
    })

    it('returns 90% when ELOC is half of the minimum amount to get a grade', () => {
      const eloc = 10
      const rank = getLinguistBadgeRank(eloc, 'JavaScript')
      expect(rank).toBe(75)
    })

    it('returns 80% when ELOC is the minimum amount to get an iron grade', () => {
      const eloc = 20
      const rank = getLinguistBadgeRank(eloc, 'JavaScript')
      expect(rank).toBe(80)
    })

    it('returns 65% when ELOC is half the maximum amount to get an iron grade', () => {
      const eloc = 35
      const rank = getLinguistBadgeRank(eloc, 'JavaScript')
      expect(rank).toBe(65)
    })

    it('returns 50% when ELOC is the minimum amount to get a bronze grade', () => {
      const eloc = 50
      const rank = getLinguistBadgeRank(eloc, 'JavaScript')
      expect(rank).toBe(50)
    })

    it('returns 37.5% when ELOC is half the maximum amount to get a bronze grade', () => {
      const eloc = 62.5
      const rank = getLinguistBadgeRank(eloc, 'JavaScript')
      expect(rank).toBe(37.5)
    })

    it('returns 25% when ELOC is the minimum amount to get a silver grade', () => {
      const eloc = 75
      const rank = getLinguistBadgeRank(eloc, 'JavaScript')
      expect(rank).toBe(25)
    })

    it('returns 17.5% when ELOC is half the maximum amount to get a silver grade', () => {
      const eloc = 82.5
      const rank = getLinguistBadgeRank(eloc, 'JavaScript')
      expect(rank).toBe(17.5)
    })

    it('returns 10% when ELOC is the minimum amount to get a gold grade', () => {
      const eloc = 90
      const rank = getLinguistBadgeRank(eloc, 'JavaScript')
      expect(rank).toBe(10)
    })

    it('returns 10% when ELOC has more than the minimum amount to get a gold grade', () => {
      const eloc = 15000
      const rank = getLinguistBadgeRank(eloc, 'JavaScript')
      expect(rank).toBe(10)
    })

    it('returns 10% when ELOC is a enough to give a gold medal', () => {
      const eloc = 164
      const rank = getLinguistBadgeRank(eloc, 'C')
      expect(rank).toBe(10)
    })

    describe('running as production', () => {
      const BUILD_ENV = String(process.env.BUILD_ENV)
      afterEach(() => {
        process.env.BUILD_ENV = BUILD_ENV
      })
      it('returns 25% when ELOC is a enough to give a silver medal in C', () => {
        process.env.BUILD_ENV = 'production'
        const eloc = 1484
        const rank = getLinguistBadgeRank(eloc, 'C')
        expect(rank).toBe(25)
      })
    })
  })
})
