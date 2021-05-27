import {
  getDataValueByIndex,
  getDataLastValue,
  getDataRangeVariation
} from './dataHandling'

describe('Data Handling', () => {
  describe('getDataLastValue', () => {
    it('returns 0 when data is not an array', () => {
      expect(getDataLastValue('string')).toBe(0)
      expect(getDataLastValue(null)).toBe(0)
      expect(getDataLastValue(false)).toBe(0)
      expect(getDataLastValue(0)).toBe(0)
      expect(getDataLastValue(3)).toBe(0)
    })
    it('returns the last index value', () => {
      expect(getDataLastValue([
        {
          value: 1
        }, {
          value: 2
        }, {
          value: 3
        },
      ])).toBe(3)
      expect(getDataLastValue([
        {
          value: 99.9
        }
      ])).toBe(99.9)
    })
  })

  describe('getDataValueByIndex', () => {
    describe('when data has the wrong format', () => {
      it('returns 0 if data is not an array', () => {
        expect(getDataValueByIndex('string', 0)).toBe(0)
        expect(getDataValueByIndex(null, 0)).toBe(0)
        expect(getDataValueByIndex(false, 0)).toBe(0)
        expect(getDataValueByIndex(0, 0)).toBe(0)
        expect(getDataValueByIndex(3, 0)).toBe(0)
      })
      it('returns 0 when data is an array with the wrong format', () => {
        expect(getDataLastValue([1, 2, 3], 0)).toBe(0)
        expect(getDataLastValue(['a', 'b', 'c'], 0)).toBe(0)
        expect(getDataLastValue([{ data: [] }], 0)).toBe(0)
        expect(getDataLastValue([{ value: '' }], 0)).toBe(0)
      })
      it('returns 0 if data is an empty array', () => {
        const value = getDataValueByIndex([], 0)
        expect(value).toBe(0)
      })
      it('returns 0 if data was not given', () => {
        const value = getDataValueByIndex()
        expect(value).toBe(0)
      })
    })

    describe('when the data has the expected format', () => {
      const correctDataFormat = [
        {
          value: 1
        }, {
          value: 2
        }, {
          value: 3
        },
      ]

      it('returns 0 if index was not given', () => {
        const value = getDataValueByIndex(correctDataFormat)
        expect(value).toBe(0)
      })
      it('returns 0 if index is not a positive integer', () => {
        expect(getDataValueByIndex(correctDataFormat, 'a')).toBe(0)
        expect(getDataValueByIndex(correctDataFormat, '')).toBe(0)
        expect(getDataValueByIndex(correctDataFormat, null)).toBe(0)
        expect(getDataValueByIndex(correctDataFormat, undefined)).toBe(0)
        expect(getDataValueByIndex(correctDataFormat, [1])).toBe(0)
        expect(getDataValueByIndex(correctDataFormat, -2)).toBe(0)
      })
      it('returns 0 if array index doesn\'t exist', () => {
        const value = getDataValueByIndex([
          {
            value: 1
          }, {
            value: 2
          }, {
            value: 3
          }
        ], 4)
        expect(value).toBe(0)
      })
      it('returns given index value', () => {
        expect(getDataValueByIndex([
          {
            value: 1
          }, {
            value: 2
          }, {
            value: 3
          },
        ], 1)).toBe(2)
        expect(getDataValueByIndex([
          {
            value: 99.9
          }
        ], 0)).toBe(99.9)
      })
    })
  })

  describe('getDataRangeVariation', () => {
    it('returns 0 when data is not an array', () => {
      expect(getDataRangeVariation('string')).toBe(0)
      expect(getDataRangeVariation(null)).toBe(0)
      expect(getDataRangeVariation(false)).toBe(0)
      expect(getDataRangeVariation(0)).toBe(0)
      expect(getDataRangeVariation(3)).toBe(0)
    })
    describe('when the initial value is 0', () => {
      it('returns 100 for positive integers', () => {
        expect(getDataRangeVariation([{
          value: 0
        }, {
          value: 3000
        }])).toBe(100)
      })
      it('returns -100 for negative integers', () => {
        expect(getDataRangeVariation([{
          value: 0
        }, {
          value: -5
        }])).toBe(-100)
      })
    })
    it('returns the positive percentile variation', () => {
      expect(getDataRangeVariation([{
        value: 60
      }, {
        value: 100
      }])).toBe(66.66666666666666)
      expect(getDataRangeVariation([{
        value: 33
      }, {
        value: 66
      }])).toBe(100)
    })
    it('returns the negative percentile variations', () => {
      expect(getDataRangeVariation([{
        value: 100
      }, {
        value: 80
      }])).toBe(-20)
    })
    it('returns 0 when the first and last values are 0', () => {
      expect(getDataRangeVariation([{
        value: 0
      }, {
        value: 100
      }, {
        value: 70
      }, {
        value: 0
      }])).toBe(0)
    })
  })
})
