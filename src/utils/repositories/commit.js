export function getCommitUrlByGitUrlAndHash (gitUrl, hash) {
  if (!gitUrl?.length || !hash?.length) {
    return null
  }
  const test = /(https?:\/\/|git@|git:\/\/)(github.com|gitlab.com)(\/|:)(.*)\/(.*)\/?(.*)?/

  // console.log(gitUrl, hash);

  try {
    const [
      // eslint-disable-next-line no-unused-vars
      fullUrl,
      // eslint-disable-next-line no-unused-vars
      protocol,
      providerUrl,
      // eslint-disable-next-line no-unused-vars
      separator,
      projectPart1,
      projectPart2,
      projectPart3
    ] = gitUrl.match(test)
    const hasGroup = projectPart3?.length

    if (!providerUrl?.length || !projectPart1?.length || !projectPart2?.length) {
      return null
    }

    if (hasGroup) {
      return `https://${providerUrl}/${projectPart1}/${projectPart2}/${projectPart3.replace('.git', '')}/commit/${hash}`
    }
    return `https://${providerUrl}/${projectPart1}/${projectPart2.replace('.git', '')}/commit/${hash}`
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Unable to process url', gitUrl, hash)
    return null
  }
}
