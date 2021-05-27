import React from 'react'
import styled from '@emotion/styled'
import { makeStyles, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { DateTime } from 'luxon'

import EmptyMessage from '@/components/Empty/EmptyMessage'

const StyledEmpty = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  color: var(--color-gray-400);
  height: ${({ height }) => height};
  margin: ${({ margin }) => {
    return `${margin?.top || 0} ${margin?.right || 0} ${margin?.bottom || 0} ${margin?.left || 0}`
  }};
`

const StyledYAxis = styled.div`
  display: grid;
  height: auto;
  flex-grow: 1;
  margin: 5px 0 40px 0;
  font-size: var(--text-xs);
  grid-template-columns: 22px 1fr;
`

const StyledYAxisLabel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  flex-grow: 1;
  align-items: flex-end;
`

const StyledYAxisContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const StyledXAxis = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  position: relative;
  margin-left: 40px;

  &::before {
    content: "";
    position: absolute;
    display: block;
    width: calc(100% - 50px);
    height: 1px;
    background: var(--color-gray-100);
    left: 50%;
    transform: translateX(-50%);
    margin-left: 1px;
  }
`

const StyledXItem = styled.div`
  &::before {
    content: "";
    display: block;
    width: 1px;
    height: 3px;
    background: var(--color-gray-100);
    transform: translate(1px, -3px);
    margin: 0 auto;
  }
`

const useStyles = makeStyles({
  title: {
    fontWeight: 'var(--text-semibold)'
  }
})

const YAxis = ({ children }) => {
  return (
    <StyledYAxis>
      <StyledYAxisLabel>
        <div>100</div>
        <div>80</div>
        <div>60</div>
        <div>40</div>
        <div>20</div>
      </StyledYAxisLabel>
      <StyledYAxisContent>
        {React.Children.map(children, (child) => child)}
      </StyledYAxisContent>
    </StyledYAxis>
  )
}

const XAxis = ({ size }) => {
  const dateInstance = DateTime.local()
  const xItems = []
  for (let i = 0; i < size; i++) {
    xItems.push(dateInstance.minus({ days: i }).toLocaleString({
      month: '2-digit',
      day: '2-digit',
      year: '2-digit'
    }))
  }
  return (
    <StyledXAxis>
      {xItems.reverse().map((date) => (
        <StyledXItem key={date}>{date}</StyledXItem>
      ))}
    </StyledXAxis>
  )
}

const getSizeByVariant = (variant) => {
  switch (variant) {
    case 'sm':
      return 3
    case 'md':
      return 4
    case 'lg':
    default:
      return 7
  }
}

export default function EmptyChart (props) {
  const {
    xAxisTitle,
    height = '285px',
    margin = {},
    messageComponent,
    messageType,
    variant = 'lg',
    message: {
      title = null,
      text = null
    } = {}
  } = props

  const size = getSizeByVariant(variant)

  const message = (
    messageComponent || <EmptyMessage type={messageType} title={title} text={text} />
  )

  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

  const classes = useStyles()

  return (
    <StyledEmpty height={height} margin={margin} size={size} data-test='empty-chart'>
      {xAxisTitle && <Typography variant='body2' className={classes.title}>{xAxisTitle}</Typography>}
      <YAxis>{message}</YAxis>
      <XAxis size={isMdUp ? size : 4} />
    </StyledEmpty>
  )
}
