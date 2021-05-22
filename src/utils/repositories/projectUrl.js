import providers from '@/enums/providers'

export function getHostUrlByProjectUrl (projectUrl) {
  if (!projectUrl?.length) {
    return null
  }

  return projectUrl
}

export function getCommitUrlByProjectUrlAndHash (projectUrl, hash) {
  if (!projectUrl?.length || !hash?.length) {
    return null
  }

  const hostUrl = getHostUrlByProjectUrl(projectUrl)

  if (hostUrl === null) {
    return null
  }

  return `${hostUrl}/commit/${hash}`
}

export function getProviderByProjectUrl (projectUrl) {
  if (!projectUrl?.length) {
    return null
  }

  return projectUrl.startsWith('https://github.com/')
    ? providers.GITHUB
    : providers.GITLAB
}

export function getUserByProjectUrl (url = '') {
  if (!url?.length) {
    return {
      user: 'Not Found',
      url: '#'
    }
  }

  const provider = getProviderByProjectUrl(url)

  const urlWithoutProvider = url
    .replace('https://github.com/', '')
    .replace('https://gitlab.com/', '')

  const userName = urlWithoutProvider
    .split('/')
    .slice(0, -1)
    .join('/')

  const userUrl = (
    provider === providers.GITHUB
      ? `https://github.com/${userName}`
      : `https://gitlab.com/${userName}`
  )

  return {
    user: userName,
    url: userUrl
  }
}
