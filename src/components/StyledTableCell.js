import { withStyles, TableCell } from '@material-ui/core'

const StyledTableCell = withStyles((theme) => ({
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
    fontSize: theme.overrides?.MuiTableCell?.head?.fontSize,
    [theme.breakpoints.up('md')]: {
      fontSize: '0.875rem',
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.overrides?.MuiTableCell?.head?.fontSize
    }
  }
}))(TableCell)

export default StyledTableCell
