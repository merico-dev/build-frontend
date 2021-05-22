const { DEMO_REPOSITORY_GITHUB, DEMO_REPOSITORY_GITLAB } = require('../../enums/repositories')

const defaultAlias = 'Contributor'

function getUserAlias (userData, prepend = '', excludeDisplayName) {
  if (!userData) {
    return `${prepend}${defaultAlias}`
  }

  let userAlias = defaultAlias
  if (userData.displayName && !excludeDisplayName) {
    userAlias = userData.displayName
  } else if (userData.githubUsername) {
    userAlias = userData.githubUsername
  } else if (userData.gitlabUsername) {
    userAlias = userData.gitlabUsername
  } else if (userData.username) {
    userAlias = userData.username
  }

  return `${prepend}${userAlias}`
}

function getServiceProvider (user) {
  if (!user) {
    return 'github'
  }

  return user.githubUsername !== '' && user.githubUsername !== null ? 'github' : 'gitlab'
}

function getDemoRepository (user) {
  const serviceProvider = getServiceProvider(user)

  if (serviceProvider === 'gitlab') {
    return DEMO_REPOSITORY_GITLAB
  }

  return DEMO_REPOSITORY_GITHUB
}

module.exports = {
  defaultAlias: defaultAlias,
  getUserAlias: getUserAlias,
  getServiceProvider: getServiceProvider,
  getDemoRepository: getDemoRepository
}
