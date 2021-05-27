export default function RepositoryStatusTitle ({ response }) {
  // Loading screen
  if (response === null) {
    return null
  }

  // At least one repository has warnings
  if (
    response?.warnings?.length
  ) {
    return 'Some of your repositories need attention'
  }

  // All repositories failed
  if (
    response?.failures?.length &&
    !response.successes?.length
  ) {
    return 'Adding repositories failed'
  }

  // All repositories were processed successfully
  if (
    !response?.failures?.length &&
    !response?.warnings?.length &&
    response?.successes?.length
  ) {
    return 'Your repositories have been successfully imported!'
  }

  // Some repositories failed and some succeeded
  return 'We were unable to import some repositories'
}
