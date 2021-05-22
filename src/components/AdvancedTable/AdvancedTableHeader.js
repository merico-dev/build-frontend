import React from 'react'
import {
  TableHead,
  TableRow,
  TableSortLabel,
  withStyles
} from '@material-ui/core'
import AdvancedTableCell from '@/components/AdvancedTable/AdvancedTableCell'

const StyleTableSortLabel = withStyles((theme) => ({
  icon: {
    opacity: 1,
  },
  root: {
    color: 'var(--color-primary-400)',
    fontSize: 'var(--text-xs)',
    [theme.breakpoints.up('md')]: {
      fontSize: 'var(--text-md)',
    },
    '&:hover .MuiTableSortLabel-icon': {
      opacity: 1
    },
    '&.MuiTableSortLabel-active': {
      color: 'var(--color-primary-400)',
    },
  }
}))(TableSortLabel)

function TableSortIcon (props) {
  const {
    className,
    isActive
  } = props

  return (
    <svg
      className={className}
      width='12'
      height='22'
      viewBox='0 0 12 22'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M6 22L0.803847 13L11.1962 13L6 22Z'
        fill={isActive ? '#ED6A45' : '#B2B4BD'}
      />
      <path
        d='M6 0L11.1962 9L0.803847 9L6 0Z'
        fill='#B2B4BD'
      />
    </svg>
  )
}

function renderLabel (label) {
  if (typeof label === 'function') {
    return label()
  }

  return label
}

export default function AdvancedTableHeader (props) {
  const {
    tableCells = [],
    order = 'asc',
    orderBy = '',
    sticky = true,
    onSort
  } = props

  return (
    <TableHead>
      <TableRow>
        {
        tableCells.map((cell) => {
          if (cell?.breakpoint === false) return false
          return (
            <AdvancedTableCell key={cell.id} sticky={sticky}>
              {
                (cell.sortable
                  ? (
                    <StyleTableSortLabel
                      active={orderBy === cell.id}
                      direction={order ?? 'asc'}
                      onClick={() => onSort(cell.id)}
                      IconComponent={
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        (props) => <TableSortIcon {...props} isActive={orderBy === cell.id} />
                      }
                    >
                      {renderLabel(cell.label)} {cell.help}
                    </StyleTableSortLabel>
                    )
                  : (
                    <>{renderLabel(cell.label)} {cell.help}</>
                    )
                )
              }
            </AdvancedTableCell>
          )
        })
      }
      </TableRow>
    </TableHead>
  )
}
