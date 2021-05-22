import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from '@emotion/styled'

import useRepositories from '@/hooks/useRepositories'
import CustomDateRange from '@/components/CustomDateRange/CustomDateRange'
import { getOptionsFromArray } from '@/utils/select/select'
import { Readiness } from '@/enums/repositoryReadiness'
import FilterSelect from '@/components/FilterSelect'
import PageFilterRepositories from '@/components/PageFilter/PageFilterRepositories'
import { mdMedia, mdMediaDown, smMedia } from '@/styles/snippets/responsive'
import { useMediaQuery, useTheme } from '@material-ui/core'

const StyledPageFilter = styled.div`
  display: flex;
  margin: 20px 0;
  flex-wrap: wrap;
  flex-direction: column;

  ${mdMedia(`
    align-items: center;
    flex-direction: row;
  `)}
`

const StyledPageFilterItem = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  margin-top: 20px;
  flex-direction: column;
  ${mdMedia(`
    margin-top: 0px;
  `)}
  ${smMedia(`
    flex-direction: row;
  `)}
`

const StyledPageFilterLabel = styled.div`
  color: var(--color-gray-400);
  margin: 0 10px 0 20px;
  font-size: var(--text-sm);
  ${({ noMarginLeft }) => noMarginLeft && 'margin-left: 0;'}
  ${mdMediaDown(`
    margin-left: 0;
  `)}
`

export default function PageFilter (props) {
  const {
    onFilterChange,
    initialStartDate,
    initialEndDate,
    multiRepo = false,
    errors = []
  } = props

  const theme = useTheme()
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [repositoryOptions, setRepositoryOptions] = useState([])
  const {
    list,
    repository,
    setRepository
  } = useRepositories({
    multiRepo
  })

  // watch filter change
  useEffect(() => {
    onFilterChange(startDate, endDate, repository)
  }, [startDate, endDate, repository, onFilterChange])

  useEffect(() => {
    setRepositoryOptions(list.data.map((repo) => {
      return { ...repo, fullName: repo.gitUrl ? `${repo.gitUrl?.split('/').reverse()[1]} / ${repo.name}` : repo.name }
    }))
  }, [list.data])

  const rangeChanged = useCallback((newDates) => {
    if (!newDates?.startDate?.length || !newDates?.endDate?.length) {
      return
    }

    setStartDate(newDates.startDate)
    setEndDate(newDates.endDate)
  }, [])

  const repositoryList = useMemo(() => {
    return multiRepo && !Array.isArray(repository) && repository ? [repository] : repository
  }, [multiRepo, repository])

  const removeRepository = useCallback((value) => {
    setRepository((list) => {
      if (Array.isArray(list)) {
        return list.filter(({ value: itemValue }) => itemValue !== value)
      }

      return list
    })
  }, [setRepository])

  const clearList = useCallback(() => {
    setRepository((currentRepositories) => {
      if (Array.isArray(currentRepositories)) {
        const listWithCommitCount = repositoryList?.map((repositoryItem) => {
          if (!list?.data?.length) {
            return repositoryItem
          }

          const userCommitCount = list.data.find(
            ({ gitUrl }) => gitUrl === repositoryItem.value
          )?.userCommitCount || 0
          return {
            ...repositoryItem,
            userCommitCount
          }
        }).sort((a, b) => a.userCommitCount - b.userCommitCount)

        return [
          listWithCommitCount[0]
        ]
      }

      return currentRepositories
    })
  }, [list, repositoryList, setRepository])

  return (
    <>
      <StyledPageFilter>
        <StyledPageFilterItem>
          <StyledPageFilterLabel noMarginLeft>Repository</StyledPageFilterLabel>
          <FilterSelect
            width={isLgUp ? 360 : 180}
            value={repository}
            setValue={setRepository}
            options={getOptionsFromArray(repositoryOptions, 'gitUrl', 'fullName', (item) => (
              item.status === Readiness.UNDERWAY &&
                    !item.lastSyncTime
            ))}
            multiple={multiRepo}
          />
        </StyledPageFilterItem>
        <StyledPageFilterItem>
          <StyledPageFilterLabel>Time Range</StyledPageFilterLabel>
          <CustomDateRange
            onRangeChange={rangeChanged}
            initialStartDate={initialStartDate}
            initialEndDate={initialEndDate}
          />
        </StyledPageFilterItem>
      </StyledPageFilter>
      {multiRepo && (
        <PageFilterRepositories
          repositoryList={repositoryList}
          removeRepository={removeRepository}
          clearList={clearList}
          errors={errors}
        />)}

    </>
  )
}
