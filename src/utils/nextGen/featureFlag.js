/**
 * Next gen feature flag
 * @returns {boolean} returns true if in next gen mode
 */
export function isNextGenEnabled () {
  try {
    const nextGenLocalStorage = JSON.parse(localStorage?.getItem('CE-nextGeneration'))

    if (nextGenLocalStorage === true) {
      return true
    }

    return false
  } catch {
    return false
  }
}
