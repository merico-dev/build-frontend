export function getRawIcon (icon) {
  if (!icon) return null

  return icon
    .replace('fill="white"', 'fill="currentColor"')
    .replace(/transform=["|'].*["|']/g, '')
}
