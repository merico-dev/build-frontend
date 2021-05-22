// import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

function useContributorProfileRouter (
  startDate,
  endDate,
  gitUrl,
  e) {
  const history = useHistory()

  return function (email, name, e) {
    history.push({
      pathname: `/contributor/profile/?email=${encodeURIComponent(email)}&name=${name}&start=${startDate}&end=${endDate}&gitUrl=${gitUrl}`,
      state: {
        gitUrl: gitUrl,
        start: startDate,
        end: endDate,
        contributorEmail: email,
        contributorName: name
      }
    })
  }
}

export { useContributorProfileRouter }
