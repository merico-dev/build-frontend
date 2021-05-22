import React, { useEffect, useState, useCallback } from 'react'
import styled from '@emotion/styled'

import { CustomDataGrid } from '@/components/CustomDataGrid/CustomDataGrid'
import { OutlinedPrimaryTooltip as Tooltip } from '@/components/CustomTooltip/OutlinedPrimaryTooltip'
import { ReactComponent as ExclamationCircle } from '@/icons/exclamation-circle.svg'

import { ReactComponent as Github } from '@/icons/github.svg'
import { ReactComponent as Gitlab } from '@/icons/gitlab.svg'

const StyledRepositoryColumn = styled.div`
  display: flex;
  flex-direction: row;

  a {
    color: #ED6A45;
    text-decoration: none;
  }
`

const StyledHeaderTooltip = styled.span`
  margin-left: 10px;
  margin-top: 3px;
  float: right;
`

const renderRepositoryColumn = (params, provider) => {
  return (
    <StyledRepositoryColumn>
      {
        // eslint-disable-next-line max-len
        provider === 'github' && (<span><a href={params.row.gitUrl?.replace('git://', 'https://')} target='_blank' rel='noreferrer'><Github width='16' color='#ED6A45' style={{ marginRight: '10px' }} /></a></span>)
      }
      {
        // eslint-disable-next-line max-len
        provider === 'gitlab' && (<span><a href={params.row.gitUrl?.replace('git://', 'https://')} target='_blank' rel='noreferrer'><Gitlab width='16' color='#ED6A45' style={{ marginRight: '10px' }} /></a></span>)
      }
      <span><a href={'/projects/repository/overview?gitUrl=' + params.row.gitUrl} color='#ED6A45'>{params.value}</a></span>
    </StyledRepositoryColumn>
  )
}

export default function TopRepositories (props) {
  const {
    data,
    perPage = 5,
    sortBy = 'rank',
    sortOrder = 'asc',
    loading = false,
    provider = 'github'
  } = props

  const [isFetching, setIsFetching] = useState(false)
  const [sortModel, setSortModel] = useState({
    field: sortBy,
    sort: sortOrder
  })

  const columns = [
    {
      field: 'rank',
      type: 'number',
      headerName: 'Rank',
    },
    {
      field: 'repository',
      type: 'string',
      headerName: 'Repository',
      flex: 3,
      renderCell: (params) => renderRepositoryColumn(params, provider)
    },
    {
      field: 'eloc',
      type: 'number',
      headerName: 'ELOC',
      columnAlign: 'right',
      headerAlign: 'right',
      // eslint-disable-next-line max-len
      renderHeader: (params) => {
        return (
          <div className='MuiDataGrid-colCellTitle'>
            {params.colDef.headerName}
            <Tooltip
              // eslint-disable-next-line max-len
              title={<>The amount of code a contributor has written, measured in ELOC, a similar but less noisey metric than LOC. <a href='/help#eloc' rel='noreferrer'>Learn more</a></>}
              // placement='top'
              interactive
              arrow
            >
              <StyledHeaderTooltip><ExclamationCircle width='18' height='18' color='#C8C9D0' /></StyledHeaderTooltip>
            </Tooltip>
          </div>
        )
      }
    },
    {
      field: 'impact',
      headerName: 'Impact',
      type: 'number',
      columnAlign: 'right',
      headerAlign: 'right',
      // eslint-disable-next-line max-len
      renderHeader: (params) => {
        return (
          <div className='MuiDataGrid-colCellTitle'>
            {params.colDef.headerName}
            <Tooltip
              // eslint-disable-next-line max-len
              title={<>The amount of impact a contributor’s code has on other contributors’ code in this repository. <a href='/help#impact'>Learn more</a></>}
              // placement='top'
              interactive
              arrow
            >
              <StyledHeaderTooltip><ExclamationCircle width='18' height='18' color='#C8C9D0' /></StyledHeaderTooltip>
            </Tooltip>
          </div>
        )
      }
    },
    {
      field: 'merges',
      headerName: 'Merges',
      type: 'number',
      columnAlign: 'right',
      headerAlign: 'right',
      renderHeader: (params) => {
        return (
          <div className='MuiDataGrid-colCellTitle'>
            {params.colDef.headerName}
            <Tooltip
              // eslint-disable-next-line max-len
              title={<>The amount of PR/MRs approved. <a href='/help#merges'>Learn more</a></>}
              // placement='top'
              interactive
              arrow
            >
              <StyledHeaderTooltip><ExclamationCircle width='18' height='18' color='#C8C9D0' /></StyledHeaderTooltip>
            </Tooltip>
          </div>
        )
      }
    },
  ]

  const onRankingSortChange = useCallback(({ sortModel }) => {

  }, [])

  useEffect(() => {
    setIsFetching(loading)
    setSortModel({ field: sortBy, sort: sortOrder })
  }, [loading, data, sortBy, sortOrder])

  return (
    <>
      <CustomDataGrid
        sortModel={sortModel}
        isFetching={isFetching}
        dataRows={data}
        columns={columns}
        onSortModelChange={onRankingSortChange}
        loadingMessage='Loading Repositories ...'
        noDataMessage='There are no top repositories available.'
        defaultRowsPerPage={perPage}
        autoHeight
      />
    </>
  )
}
