import { shouldShowVariation } from './variation'

describe('variation', () => {
  describe('shouldShowVariation', () => {
    it('hides variation when the range is all time', () => {
      expect(shouldShowVariation('all')).toBe(false)
    })
    it('shows variation when no range is set', () => {
      expect(shouldShowVariation('')).toBe(true)
    })
    it('shows variation when range is month', () => {
      expect(shouldShowVariation('month')).toBe(true)
    })
    it('shows variation when range is custom', () => {
      expect(shouldShowVariation('custom')).toBe(true)
    })
    it('shows variation when range is quarter', () => {
      expect(shouldShowVariation('quarter')).toBe(true)
    })
  })
})
