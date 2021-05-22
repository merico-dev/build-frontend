import { DateTime } from 'luxon'

export function diffRepositoriesByUpdatedDate (repo_a, repo_b) {
  if (repo_a?.lastUpdated === repo_b?.lastUpdated) {
    return 0
  }

  const repo_a_date = DateTime.fromISO(repo_a?.lastUpdated)
  const repo_b_date = DateTime.fromISO(repo_b?.lastUpdated)

  if (!repo_a_date.isValid || !repo_b_date.isValid) {
    return 0
  }

  return repo_b_date.diff(repo_a_date).toObject().milliseconds
}
