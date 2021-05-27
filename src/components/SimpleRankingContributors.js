import { Typography, withStyles } from '@material-ui/core'

const SimpleRankingContributors = withStyles((theme) => ({
  body2: {
    marginTop: '40px',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-gray-400)',
    [theme.breakpoints.down('md')]: {
      marginTop: '10px'
    }
  }
}))(Typography)

export default SimpleRankingContributors
