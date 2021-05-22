import React, { useState, useRef } from 'react'
import styled from '@emotion/styled'
import {
  Card,
  CardContent,
  makeStyles
} from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid'
import classNames from 'classnames'

import ErrorBoundary from '@/components/ErrorBoundary'
import PageLoading from '@/components/PageLoading'
import { ReactComponent as SortUpIcon } from '@/icons/sort-up.svg'
import { ReactComponent as SortDownIcon } from '@/icons/sort-down.svg'

const useStyles = makeStyles((theme) => ({
  card: {
    padding: '0px'
  },
}))

const tableStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    border: 0,
    '& div[role=grid]': {
      border: 0
    },
    '& div[aria-selected="true"]': {
      color: '#ED6A45',
      backgroundColor: '#FFF3EB',
      fontWeight: 'bold'
    },
    // arrow icon
    '& .MuiDataGrid-colCell .MuiDataGrid-iconButtonContainer': {
      padding: '0 0 0 7px',
    },
    '& .MuiDataGrid-colCell.cdg-table-header': {
      fontSize: 'var(--text-md)',
      textAlign: 'center',
      color: 'var(--color-brand-400)',
      outline: 'none !important'
    },
    '& .MuiDataGrid-colCell.cdg-table-header .MuiDataGrid-colCellTitleContainer': {
      justifyContent: 'flex-end',
      // revert arrow side
      flexDirection: 'row-reverse',
    },
    '& .MuiDataGrid-colCell.cdg-table-header-align-center .MuiDataGrid-colCellTitleContainer': {
      justifyContent: 'center'
    },
    '& .MuiDataGrid-colCell.cdg-table-header-align-left .MuiDataGrid-colCellTitleContainer': {
      justifyContent: 'flex-end'
    },

    '& .MuiDataGrid-colCell.cdg-table-header-align-right .MuiDataGrid-colCellTitleContainer': {
      justifyContent: 'flex-start'
    },
    '& .MuiDataGrid-colCell.cdg-table-header:first-child': {
      paddingLeft: '30px'
    },
    '& .MuiDataGrid-colCell.cdg-table-header .MuiDataGrid-colCellTitle': {
      fontWeight: 'var(--text-semibold)',
      outline: 'none'
    },
    '& .cdg-table-header .MuiDataGrid-columnSeparator': {
      opacity: '0 !important'
    },
    '& .MuiDataGrid-columnSeparator': {
      opacity: '0 !important'
    },
    '& .cdg-table-cell': {
      fontSize: 'var(--text-md)',
      textAlign: 'left',
      color: 'var(--color-gray-400)',
      outline: 'none !important',
      '& a[disabled]': {
        color: 'var(--color-gray-400)',
        opacity: '0.6',
        pointerEvents: 'none'
      }
    },
    '& .cdg-table-cell:first-child': {
      paddingLeft: '30px'
    },
    '& .cdg-table-cell-align-center': {
      textAlign: 'center',
      justifyContent: 'center'
    },
    '& .cdg-table-cell-align-right': {
      textAlign: 'right',
      justifyContent: 'flex-end',
    },
    '& .cdg-table-cell-align-left': {
      textAlign: 'left',
      justifyContent: 'flex-start'
    },
    '& .MuiDataGrid-footer': {
      marginTop: ({ defaultRowsPerPage, dataRows, hideFooterPagination, autoHeight }) => {
        return hideFooterPagination || !dataRows || (dataRows?.length < defaultRowsPerPage) ? '-10px' : '0'
      }
    },
    '& .MuiDataGrid-main': {
      paddingBottom: '36px'
    },
    '& .MuiDataGrid-row': {
      '&:hover': {
        backgroundColor: 'var(--color-background-orange-400)'
      }
    }
  }
}))

const StyledNoRankingDataMessage = styled.div`
  color: #717484;
  font-size: 22px;
  justify-content: center;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  height: 100px;
`

const StyledLoading = styled.div`
  text-align: left;
  justify-content: left;
  font-size: 18px;
  padding: 10px;

  > span {
    line-height: 40px;
    padding-left: 20px;
    color: #888888;
    display: inline-block;
  }
`

const formatColumn = (column) => {
  return {
    headerClassName: (
      column.headerAlign
        ? `cdg-table-header cdg-table-header-align-${column.headerAlign}`
        : 'cdg-table-header'
    ),
    cellClassName: (
      column.columnAlign
        ? `cdg-table-cell cdg-table-cell-align-${column.columnAlign}`
        : 'cdg-table-cell'
    ),
    flex: 1,
    ...column,
  }
}

export function CustomDataGrid (props) {
  const {
    defaultRowsPerPage = 10,
    sortModel = [],
    enableCheckboxes = false,
    isFetching,
    dataRows = [],
    columns = [],
    onSortModelChange,
    height = 680,
    getRowId,
    hideFooterPagination,
    page,
    autoHeight = false,
    hideFooterSelectedRowCount = !enableCheckboxes ?? false,
    loadingMessage = 'Loading Report Metrics ...',
    noDataMessage = 'There are no matching metrics available.'
  } = props

  const DataGridRef = useRef(null)
  const classes = useStyles()
  const tableClasses = tableStyles(props)

  // eslint-disable-next-line no-unused-vars
  const [pageSize, setPageSize] = useState(defaultRowsPerPage)

  return (
    <div>
      <Card className={classNames(classes.card, classes.firstCard)} data-test='cdg-data-card'>
        <CardContent style={{ padding: '0' }} data-test='cdg-data-content'>
          <div
            style={{ height: autoHeight ? 'auto' : `${height}px`, width: '100%' }}
            className={tableClasses.root}
            data-test='cdg-datagrid-wrapper'
          >
            {(isFetching &&
              <StyledLoading
                data-test='cdg-fetching-data'
              >
                <PageLoading size={24} /> <span>{loadingMessage}</span>
              </StyledLoading>
              )}
            {(!isFetching && dataRows?.length > 0 &&
              <DataGrid
                ref={DataGridRef}
                autoHeight={autoHeight}
                rows={dataRows}
                columns={columns.map(column => formatColumn(column))}
                sortModel={Array.isArray(sortModel) ? sortModel : [sortModel]}
                pageSize={pageSize}
                disableColumnMenu
                components={{
                  ColumnSortedDescendingIcon: SortDownIcon,
                  ColumnSortedAscendingIcon: SortUpIcon
                }}
                checkboxSelection={enableCheckboxes}
                data-test='cdg-datagrid'
                density='comfortable'
                onSortModelChange={(sortModel) => onSortModelChange && onSortModelChange(sortModel)}
                disableSelectionOnClick
                hideFooterSelectedRowCount={hideFooterSelectedRowCount}
                hideFooterPagination={!dataRows?.length > 0 || defaultRowsPerPage >= dataRows?.length || hideFooterPagination}
                getRowId={(row) => getRowId ? getRowId(row) : row?.id}
                page={page}
              />
            )}
            {(!isFetching && dataRows?.length === 0 &&
              <StyledNoRankingDataMessage data-test='cdg-no-data'>{noDataMessage}</StyledNoRankingDataMessage>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BoundedDataGrid () {
  return (
    <ErrorBoundary style={{ padding: '50px' }}>
      <CustomDataGrid />
    </ErrorBoundary>
  )
}
