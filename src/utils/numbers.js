/**
 * Convert number to a human readable format
 * @param {number} value Input value
 * @param {*} digits Number of digits after the dot
 */
export function humanPercentage (value, digits = 0) {
  return Number(value * 100).toFixed(digits)
}
