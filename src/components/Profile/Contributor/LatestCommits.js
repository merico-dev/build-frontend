import React, { useEffect, useState, useCallback } from 'react'
import styled from '@emotion/styled'
import { CustomDataGrid } from '@/components/CustomDataGrid/CustomDataGrid'

import { OutlinedPrimaryTooltip as Tooltip } from '@/components/CustomTooltip/OutlinedPrimaryTooltip'
import { ReactComponent as ExclamationCircle } from '@/icons/exclamation-circle.svg'

const StyledHeaderTooltip = styled.span`
  margin-left: 10px;
  margin-top: 3px;
  float: right;
`

export default function LatestCommits (props) {
  const {
    data,
    perPage = 5,
    sortBy = 'eloc',
    sortOrder = 'desc',
    loading = false
  } = props

  const [isFetching, setIsFetching] = useState(false)
  const [sortModel, setSortModel] = useState({
    field: sortBy,
    sort: sortOrder
  })

  const columns = [
    {
      field: 'time',
      type: 'string',
      headerName: 'Time',
      flex: 2,
    },
    {
      field: 'message',
      type: 'string',
      headerName: 'Message',
      flex: 3,
    },
    {
      field: 'eloc',
      type: 'number',
      headerName: 'ELOC',
      alignCenter: true,
      // eslint-disable-next-line max-len
      renderHeader: (params) => {
        return (
          <div className='MuiDataGrid-colCellTitle'>
            {params.colDef.headerName}
            <Tooltip
              // eslint-disable-next-line max-len
              title={<>The amount of code a contributor has written, measured in ELOC, a similar but less noisey metric than LOC <a href='/help#eloc' rel='noreferrer'>Learn more</a></>}
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
      alignCenter: true,
      renderCell: (params) => `${params.value}%`,
      // eslint-disable-next-line max-len
      renderHeader: (params) => {
        return (
          <div className='MuiDataGrid-colCellTitle'>
            {params.colDef.headerName}
            <Tooltip
              // eslint-disable-next-line max-len
              title={<>The amount of impact a contributor’s code has on other contributors’ code in this repository <a href='/help#impact'>Learn more</a></>}
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
        loadingMessage='Loading Commit Data ...'
        noDataMessage='There are no commit records available.'
        defaultRowsPerPage={perPage}
        autoHeight
      />
    </>
  )
}
