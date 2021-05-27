import React from 'react'
import {
  makeStyles,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles({
  subtitle: {
    margin: '0 0 10px'
  }
})

export default function PageSubtitle (props) {
  const { children } = props

  const classes = useStyles()

  return (
    <Typography variant='h2' className={classes.subtitle}>{React.Children.map(children, (child) => child)}</Typography>
  )
}
