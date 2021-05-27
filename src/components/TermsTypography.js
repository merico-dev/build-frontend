import { Typography, withStyles } from '@material-ui/core'

export default withStyles((theme) => ({
  h2: {
    marginTop: '30px',
    marginBottom: '20px',
    fontSize: 'var(--text-md)',
    color: theme.typography.h2.color,
    [theme.breakpoints.up('md')]: {
      marginTop: '32px',
      marginBottom: '24px',
      fontSize: theme.typography.h2.fontSize,
      color: theme.typography.h2.color
    }
  },
  h3: {
    marginTop: '32px',
    marginBottom: '24px',
    fontSize: 'var(--text-sm)',
    color: theme.typography.h3.color,
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.h3.fontSize,
      color: theme.typography.h3.color,
    },
  },
  h4: {
    marginTop: '22px',
    marginBottom: '14px',
    fontSize: 'var(--text-sm)',
    color: 'var(--color-primary-400)',
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.h4.fontSize,
      color: theme.typography.h3.color,
    },
  },
  body1: {
    marginBottom: '16px',
    fontSize: 'var(--text-xs)',
    [theme.breakpoints.up('md')]: {
      fontSize: theme.typography.body1.fontSize,
    }
  },
  type: {
    marginBottom: '10px',
    fontFamily: 'Source Sans Pro',
    fontSize: 'var(--text-sm)',
    fontStyle: 'normal',
    fontWeight: 600,
    color: '#ED6A45',
    lineHight: '24px',
    letterSpacing: '0em',
    textAlign: 'left',
    display: 'block',
    clear: 'both',
    [theme.breakpoints.up('md')]: {
      fontSize: 'var(--text-md)',
    }
  },
  list: {
    fontSize: 'var(--text-xs)',
    [theme.breakpoints.up('md')]: {
      fontSize: 'var(--text-sm)'
    }
  }
}))(Typography)
