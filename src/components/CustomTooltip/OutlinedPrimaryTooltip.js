import { withStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'

const tooltipStyles = theme => ({
  root: {
    fontSize: '18px',
    backgroundColor: '#ffffff'
  },
  popper: {
  },
  tooltip: {
    fontSize: '13px',
    backgroundColor: '#ffffff',
    color: '#717484',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    maxWidth: '200px',
    border: '1px solid #ED6A45',
    '& > a': {
      display: 'inline-block',
      clear: 'both',
      color: '#ED6A45',
    }
  },
  tooltipArrow: {
  },
  arrow: {
    color: '#ffffff',
    '&::before': {
      border: '1px solid #ED6A45'
    }
  }
})

export const OutlinedPrimaryTooltip = withStyles(tooltipStyles)(Tooltip)
