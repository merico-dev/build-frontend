export const getDataValueByIndex = (data = [], index, key = 'value') => {
  if (
    !Array.isArray(data) ||
    !Number.isInteger(index) ||
    index < 0 ||
    !Number.isFinite(data[index]?.[key])
  ) return 0

  return data[index][key]
}

export const getDataLastValue = (data = [], key = 'value') => {
  if (!Array.isArray(data)) return 0

  return getDataValueByIndex(data, data.length - 1, key)
}

export const getDataRangeVariation = (data = [], lastValue, key = 'value') => {
  if (!Array.isArray(data)) return 0

  const to = Number.isFinite(lastValue) ? lastValue : getDataLastValue(data, key)
  const from = getDataValueByIndex(data, 0, key)
  const numericVariation = to - from

  if (to === 0 && from === 0) {
    return 0
  }

  if (from === 0) {
    return (to > 0) ? 100 : -100
  }

  if (Number.isNaN(numericVariation)) return 0

  return ((numericVariation / from) * 100)
}
