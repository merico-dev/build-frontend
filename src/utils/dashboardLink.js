import { isNextGenEnabled } from '@/utils/nextGen/featureFlag'

/**
 * Returns the dashboard link
 * @returns {string} dashboard link
 */
export function dashboardLink () {
  if (isNextGenEnabled()) {
    return '/dashboard/overview'
  }

  return '/dashboard'
}
