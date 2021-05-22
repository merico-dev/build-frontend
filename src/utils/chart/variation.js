import { isAllTime } from '@/utils/chart/isAllTime'

export function shouldShowVariation (range = '') {
  return range !== 'all'
  // return !['all'].includes(range)
}

export function shouldShowVariationByDates (startDate = '', endDate) {
  if (!startDate?.length || !endDate?.length) {
    return false
  }

  return isAllTime(startDate, endDate)
}
