import React from 'react'
import {
  Table,
  TableBody,
  TableRow,
  TableContainer,
  TablePagination
} from '@material-ui/core'
import styled from '@emotion/styled'
import { mdMedia } from '@/styles/snippets/responsive'
import scrollbar from '@/styles/snippets/scrollbar'

import AdvancedTableHeader from '@/components/AdvancedTable/AdvancedTableHeader'
import AdvancedTableCell from '@/components/AdvancedTable/AdvancedTableCell'

const StyledTableRow = styled(TableRow)`
  cursor: pointer;
  &:hover,
  &.active {
    background-color: #FFF3EB;
  }
  &.active {
    color: var(--color-primary-400);
    cursor: default;
  }
`

const StyledTableContainer = styled(TableContainer)`
  ${({ stickyHeader }) => (stickyHeader
    ? `
      max-height: 505px;
      position: relative;
    `
    : ''
  )}
  &.MuiTableContainer-root {
    border-width: 0;
  }
  ${scrollbar({ width: '12px' })}
  ${({ bordered }) => (bordered
    ? mdMedia(`
      background: linear-gradient(
          0deg, rgba(0, 0, 0, 0) 461px,
          var(--color-gray-400) 462px,
          rgba(0, 0, 0, 0) 462px
      );
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
    `)
    : null)}
`

const StyledEmptyMessage = styled.p`
  font-size: var(--text-xl);
  color: var(--color-gray-500);
  font-weight: var(--text-semibold);
  margin-top: 57px;
  text-align: center;
`

export default function AdvancedTable (props) {
  const {
    heading,
    data,
    order,
    orderBy,
    currentPage,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
    setOrderBy,
    setOrder,
    id,
    sticky = true,
    borderedTable,
    total = 0,
    emptyMessage
  } = props

  return (
    <>
      <StyledTableContainer bordered={borderedTable}>
        <Table>
          <AdvancedTableHeader
            tableCells={heading}
            orderBy={orderBy}
            order={order}
            sticky={sticky}
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
            {
              data.map((row) => (
                <StyledTableRow
                  key={row[id]}
                >
                  {
                  heading.map((cell) => {
                    if (cell?.breakpoint === false) return false

                    return (
                      <AdvancedTableCell key={cell.id} sticky={sticky} width={cell?.width}>{
                        cell.formatter ? cell.formatter(row[cell.id], row) : row[cell.id]
                      }
                      </AdvancedTableCell>
                    )
                  })
                }
                </StyledTableRow>
              ))
          }
          </TableBody>
        </Table>
      </StyledTableContainer>
      {
        total > 0
          ? (
            <TablePagination
              page={currentPage}
              component='div'
              count={total}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[5, 10, 50]}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
            )
          : (
            <StyledEmptyMessage>
              {emptyMessage}
            </StyledEmptyMessage>
            )
      }
    </>
  )
}
