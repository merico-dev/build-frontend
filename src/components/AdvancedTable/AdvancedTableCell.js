import React from 'react'
import {
  TableCell,
  withStyles
} from '@material-ui/core'

const StyledStickyTableCell = withStyles((theme) => ({
  body: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '170px',
    [theme.breakpoints.up('md')]: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: 'auto'
    }
  },
  head: {
    color: 'var(--color-primary-400)',
    fontSize: 'var(--text-xs)',
    // fontSize: theme.overrides?.MuiTableCell?.head?.fontSize,
    [theme.breakpoints.up('md')]: {
      fontSize: 'var(--text-md)',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 'var(--text-md)',
    }
  }
}))(TableCell)

const StyledTableCell = withStyles((theme) => ({
  head: {
    borderBottom: 'solid 1px var(--color-gray-300)',
    fontSize: 'var(--text-md)',
    '&::before, &::after': {
      display: 'none'
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 'var(--text-xl)',
    }
  },
  body: {
    borderBottom: 'solid 1px var(--color-gray-300)',
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-500)',
    [theme.breakpoints.up('md')]: {
      fontSize: 'var(--text-md)',
    }
  }
}))(StyledStickyTableCell)

export default function AdvancedTableCell (props) {
  const {
    sticky = true,
    ...rest
  } = props
  // eslint-disable-next-line react/jsx-props-no-spreading
  return !sticky ? <StyledTableCell {...rest} /> : <StyledStickyTableCell {...rest} />
}
