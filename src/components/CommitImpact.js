import React, { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableRow,
  TableContainer,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  TablePagination,
  Link,
  makeStyles
} from '@material-ui/core'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import { mdMedia } from '@/styles/snippets/responsive'
import scrollbar from '@/styles/snippets/scrollbar'
import HeatBar from '@/components/HeatBar'
import FilterSearch from '@/components/FilterSearch'
import HelpPopover from '@/components/HelpPopover'
import AdvancedTableHeader from '@/components/AdvancedTable/AdvancedTableHeader'
import StyledTableCell from '@/components/StyledTableCell'
import FetchStatus from '@/components/FetchStatus'
import { FETCH_COMMITS } from '@/store/reducers/impact'
import { SUCCEED } from '@/store/statusTypes'
import { getCommitUrlByGitUrlAndHash } from '@/utils/repositories/commit'

const StyledLabelWrapper = styled.div`
  margin: 0 0 20px 121px;
`

const StyledContent = styled.div`
  display: flex;
`

const StyledTableWrapper = styled.div`
  width: 100%;
  z-index: 0;

  ${({ hasHeatBar }) => hasHeatBar && `
    margin-left: 38px;
  `}
`

const StyledCommitFilters = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const StyledFilterSearch = styled(FilterSearch)`
  margin-left: auto !important;
`

const StyledTableContainer = styled(TableContainer)`
  max-height: 505px;
  position: relative;
  &.MuiTableContainer-root {
    border-width: 0;
  }
  ${scrollbar({ width: '12px' })}
  ${mdMedia(css`
    background: linear-gradient(0deg, rgba(0, 0, 0, 0) 461px, var(--color-gray-400) 462px, rgba(0, 0, 0, 0) 462px);

    &::before{
      content: '';
      position: sticky;
      width: 100%;
      height: 1px;
      background: var(--color-gray-300);
      top: 41px;
      z-index: 3;
      display: block;
    }
    &.MuiTableContainer-root {
      border-width: 1px;
    }
  `)}
`

const StyledTableRow = styled(TableRow)`
  cursor: pointer;
  &:hover,
  &.active {
    background-color: #FFF3EB;
    color: var(--color-primary-400);
  }
  &.active {
    cursor: default;
  }
`

const StyledEmptyImpact = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction:column;
  margin: 20px;
`

const StyledFetchStatusContainer = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
  height: 312px;
  width: 100%;

`

const tablePaginationStyles = makeStyles({
  root: {
    backgroundColor: 'var(--color-primary-400)',
    color: 'var(--color-background)',
    width: '32px',
    height: '32px',
    borderRadius: 'var(--radius-xs)',
    '& + .MuiButtonBase-root': {
      marginLeft: '20px'
    },
    '&:hover': {
      backgroundColor: 'var(--color-primary-500)',
      color: 'var(--color-background)',
    },
    '&.Mui-disabled': {
      backgroundColor: 'var(--color-background-orange-400)',
      color: 'var(--color-background)',
    }
  },
})

function getMinMaxAverage (data) {
  if (!Array.isArray(data) || !data.length) return [0, 0, 0]

  const sorted = [...data].sort((a, b) => {
    return a.dev_value - b.dev_value
  })

  const average = data.reduce((acc, cur) => {
    return acc + cur.dev_value
  }, 0) / data.length

  return [
    sorted[0].dev_value,
    sorted[sorted.length - 1].dev_value,
    average
  ]
}

const CommitListStatus = ({ status }) => {
  if (status !== SUCCEED) {
    return (
      <tr>
        <td colSpan='4'>
          <StyledFetchStatusContainer>
            <FetchStatus
              status={status}
            />
          </StyledFetchStatusContainer>
        </td>
      </tr>
    )
  }

  return (
    <StyledTableRow>
      <StyledTableCell colSpan='4'>
        <StyledEmptyImpact>
          <Typography variant='h4'>
            You have no commits in this repository for the selected range.
          </Typography>
        </StyledEmptyImpact>
      </StyledTableCell>
    </StyledTableRow>
  )
}

export default function CommitImpact (props) {
  const {
    filters = {},
    showHeatBar = true,
    showHelp = true
  } = props
  const {
    commits
  } = useSelector((state) => state.impact)
  const tablePaginationClasses = tablePaginationStyles()

  const [selectedCommit, setSelectedCommit] = useState(null)
  const [heatbarCommits, setHeatbarCommits] = useState(null)
  const [averageCommit, setAverageCommit] = useState(null)
  const [minMaxAverage, setMinMaxAverage] = useState(null)
  const [order, setOrder] = useState(null)
  const [orderBy, setOrderBy] = useState('dev_value')
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState('')
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const dispatch = useDispatch()

  const onChangePage = (_event, page) => {
    setCurrentPage(page)
  }
  const onChangeRowsPerPage = ({ target }) => {
    setCurrentPage(0)
    setRowsPerPage(target.value)
  }

  const handleSearchChange = (target) => {
    if (target.value === search) return

    setSearch(target.value)
  }

  useEffect(() => {
    setMinMaxAverage(null)
    dispatch({
      type: FETCH_COMMITS,
      payload: {
        ...filters,
        limit: rowsPerPage,
        sortColumn: orderBy === 'dev_value' ? 'report_commit_value.dev_value' : orderBy,
        sortDirection: order,
        offset: currentPage * rowsPerPage,
        search
      }
    })
  }, [
    filters,
    dispatch,
    rowsPerPage,
    orderBy,
    order,
    currentPage,
    search
  ])

  useEffect(() => {
    if (!commits.data) return

    const localMinMaxAverage = getMinMaxAverage(commits.data)
    setAverageCommit({
      label: 'My Average Impact',
      value: localMinMaxAverage[2],
      color: '#717484'
    })
    setMinMaxAverage(localMinMaxAverage)
  }, [setAverageCommit, setMinMaxAverage, commits])

  useEffect(() => {
    if (!averageCommit) return

    const selected = selectedCommit
      ? [{
          label: selectedCommit.title,
          value: selectedCommit.dev_value,
          color: 'var(--color-primary-400)'
        }]
      : []

    setHeatbarCommits([
      averageCommit,
      ...selected
    ])
  }, [averageCommit, selectedCommit, setHeatbarCommits])

  const tableCells = [
    {
      id: 'commit_timestamp',
      label: 'Time',
      formatter: (value) => {
        return DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT)
      },
      sortable: true
    },
    {
      id: 'title',
      label: 'Message',
      formatter: (info, row) => {
        const url = getCommitUrlByGitUrlAndHash(filters?.gitUrl, row.hash)

        if (!url?.length) {
          return info
        }

        return (
          <Link
            href={url}
            color='inherit'
            target='_blank'
            rel='noreferrer'
          >
            {info}
          </Link>
        )
      }
    },
    {
      breakpoint: isMdUp,
      id: 'dev_equivalent',
      label: 'ELOC',
      help: showHelp
        ? (
          <HelpPopover
            content={`
          ELOC is a relatively accurate estimate of the development effort.
          It is computed from the edit operations on the
          abstract syntax trees (ASTs) during the development process.
          Compared to counting lines of code or the number of commits,
          it contains less noise, such as line breaks or commit sizes.
        `}
            moreLink='/help#eloc'
          >
            <IconButton
              size='small'
              aria-label='More information'
            >
              <QuestionCircle width='17.5' height='17.5' />
            </IconButton>
          </HelpPopover>
          )
        : null,
      sortable: true
    },
    {
      id: 'dev_value',
      label: 'Impact',
      help: showHelp
        ? (
          <HelpPopover
            content='Impact is a measure of how important code is. It leverages the location of code in the function call graph.'
            moreLink='/help#impact'
          >
            <IconButton
              size='small'
              aria-label='More information'
            >
              <QuestionCircle width='17.5' height='17.5' />
            </IconButton>
          </HelpPopover>
          )
        : null,
      formatter: (value) => {
        return `${Number(value.toFixed(6))}%`
      },
      sortable: true
    }
  ]

  const commitList = commits.data?.length
    ? (
        commits.data.map((commit) => (
          <StyledTableRow
            key={commit.hash}
            className={commit.hash === selectedCommit?.hash ? 'active' : ''}
            onClick={() => setSelectedCommit(commit)}
          >
            {
          tableCells.map((cell) => {
            if (cell?.breakpoint === false) return false

            return (
              <StyledTableCell key={cell.id}>{
                cell.formatter ? cell.formatter(commit[cell.id], commit) : commit[cell.id]
              }
              </StyledTableCell>
            )
          })
        }
          </StyledTableRow>
        ))
      )
    : (
      <CommitListStatus status={commits.status} />
      )
  const hasHeatBar = isLgUp && showHeatBar

  return (
    <div>
      {hasHeatBar && (
        <StyledLabelWrapper>
          <Typography variant='body1' color='textSecondary' component='p'><strong>My Impact</strong></Typography>
        </StyledLabelWrapper>
      )}
      <StyledContent>
        {hasHeatBar && (
          <HeatBar
            min={minMaxAverage?.[0]}
            max={minMaxAverage?.[1]}
            series={heatbarCommits}
            dataPointWidth={140}
          />
        )}
        <StyledTableWrapper hasHeatBar={hasHeatBar}>
          {isMdUp && (
            <StyledCommitFilters>
              <StyledFilterSearch
                placeholder='Search commits'
                onFilter={handleSearchChange}
                search={search}
              />
            </StyledCommitFilters>
          )}
          <StyledTableContainer>
            <Table stickyHeader>
              <AdvancedTableHeader
                tableCells={tableCells}
                orderBy={orderBy}
                order={order}
                onSort={(id) => {
                  setOrderBy(id)
                  if (orderBy === id) {
                    setOrder(order === 'asc' ? 'desc' : 'asc')
                    return
                  }

                  setOrder('asc')
                }}
              />
              <TableBody>
                {commitList}
              </TableBody>
            </Table>
          </StyledTableContainer>
          <TablePagination
            page={currentPage}
            component='div'
            count={Number(commits.totalRecords) || 0}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 50]}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            nextIconButtonProps={{
              color: 'primary',
              classes: tablePaginationClasses
            }}
            backIconButtonProps={{
              color: 'primary',
              classes: tablePaginationClasses
            }}
            labelDisplayedRows={
              ({ from, to, count, page }) => {
                try {
                  return `Page ${page + 1} of ${Math.ceil(Number(commits.totalRecords) / 10)}`
                } catch {
                  return `${from}-${to} of ${count}`
                }
              }
            }
          />
        </StyledTableWrapper>
      </StyledContent>
    </div>
  )
}
