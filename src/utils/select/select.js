export function getOptionsFromArray (list, value, label, isDisabled) {
  if (!list?.length) { return [] }
  return list.map((item) => ({
    label: item[label],
    value: item[value],
    isDisabled: isDisabled && isDisabled(item)
  }))
}
