import React from 'react'
import { Card, makeStyles, Typography } from '@material-ui/core'

import MericoIssuer from '@/images/merico-issuer.png'
import styled from '@emotion/styled'

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1000px',
    margin: '0 auto',
    alignItems: 'center',
    padding: '25px',
    [theme.breakpoints.up('sm')]: {
      padding: '40px 80px',
    }
  },
  heading: {
    textTransform: 'uppercase',
    fontWeight: 600,
    color: 'var(--color-gray-400)'
  },
  text: {
    [theme.breakpoints.up('xs')]: {
      fontSize: 'var(--text-sm)'
    }
  }
}))

const StyleIssuerImage = styled.img`
  margin-bottom: 40px;
  max-width: 100%;
`

export default function Issuer () {
  const classes = useStyles()
  return (
    <Card className={classes.card}>
      <Typography className={classes.heading}>ISSUER</Typography>
      <StyleIssuerImage src={MericoIssuer} alt='merico$ build' />
      <Typography className={classes.text}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Donec adipiscing tristique risus nec feugiat.
        Elementum nibh tellus molestie nunc. Nibh sed pulvinar proin gravida.
        Sit amet consectetur adipiscing elit ut aliquam.
        Nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur.
        Vitae elementum curabitur vitae nunc sed velit.
        Volutpat diam ut venenatis tellus in.
        Iaculis nunc sed augue lacus viverra vitae.
        Purus sit amet luctus venenatis lectus magna fringilla urna.
      </Typography>
    </Card>
  )
}
