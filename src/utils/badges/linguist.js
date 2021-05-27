import { grades } from '@/enums/badge'
import getThresholdByEnv from '@/enums/thresholds'

const calculateRank = (eloc, elocRange, rankRange) => {
  const points = rankRange[1] - rankRange[0]
  const elocGrowth = (eloc - elocRange[0]) / (elocRange[1] - elocRange[0])

  if (elocGrowth === 0) {
    return rankRange[1]
  }

  const percentualGrowth = elocGrowth * points

  return percentualGrowth + rankRange[0]
}

const getThresholdByLanguage = (language) => {
  const thresholds = getThresholdByEnv(process.env.BUILD_ENV)
  return thresholds?.badges?.linguist[language] || null
}

export const getLinguistBadgeRank = (elocs, language) => {
  const thresholds = getThresholdByLanguage(language)
  if (!elocs || !thresholds) {
    return 99
  }

  let rank = 0

  if (elocs >= thresholds[grades.gold]) {
    rank = 10
  } else if (elocs >= thresholds[grades.silver]) {
    rank = calculateRank(
      elocs,
      [thresholds[grades.silver], thresholds[grades.gold]],
      [10, 25]
    )
  } else if (elocs >= thresholds[grades.bronze]) {
    rank = calculateRank(
      elocs,
      [thresholds[grades.bronze], thresholds[grades.silver]],
      [25, 50]
    )
  } else if (elocs >= thresholds[grades.iron]) {
    rank = calculateRank(
      elocs,
      [thresholds[grades.iron], thresholds[grades.bronze]],
      [50, 80]
    )
  } else {
    rank = 100 - ((elocs / thresholds[grades.iron]) * 50)
  }

  return rank
}
