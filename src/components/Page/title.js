import React from 'react'
import {
  makeStyles,
  Typography
} from '@material-ui/core'

const useStyles = makeStyles({
  title: {
    margin: '0 0 20px'
  }
})

export default function PageTitle (props) {
  const { children } = props

  const classes = useStyles()

  return (
    <Typography variant='h1' className={classes.title}>{React.Children.map(children, (child) => child)}</Typography>
  )
}
