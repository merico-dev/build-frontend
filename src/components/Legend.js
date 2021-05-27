import React from 'react'
import styled from '@emotion/styled'
import { getColorGenerator } from 'charts'

import { colorSet } from '@/enums/colors'
import { ellipsis } from '@/utils/string'
import { Link } from 'react-router-dom'
import { makeStyles, Typography } from '@material-ui/core'
import HelpPopover from './HelpPopover'

const StyledLegend = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 22px;
  flex-wrap: wrap;
  row-gap: 10px;

  > div:first-of-type > div {
    margin-left: 0;
  }
`
const StyledLegendItem = styled(Link)`
  font-size: var(--text-xs);
  display: inline-flex;
  align-items: center;
  color: ${({ color }) => color};
  font-weight: var(--text-semibold);
  text-decoration: none;
`
const StyledLegendIcon = styled.div`
  width: 20px;
  height: 12px;
  border-radius: 2px;
  margin: 0 8px 0 20px;
  ${({ noMarginLeft }) => noMarginLeft && 'margin-left: 0;'}
  background: ${({ color }) => color};
`

const StyledLink = styled(Link)`
  color: var(--color-primary-400);
`

const useStyles = makeStyles({
  body1: {
    margin: '0',
    fontWeight: 'var(--text-semibold)',
    textAlign: 'center',
    display: 'block'
  }
})

const LegendEmptyMessage = () => {
  const classes = useStyles()

  return (
    <>
      <Typography
        variant='body1'
        className={classes.body1}
        color='primary'
        component='span'
      >No Data
      </Typography>
      Your commits might be associated with different email addresses.
      You can add them in <StyledLink to='/account'>settings</StyledLink>.
    </>
  )
}

export default function Legend ({ data }) {
  const colors = getColorGenerator(null, colorSet)

  return (
    <StyledLegend>
      {
        data.map(({ name, color, noCommits, noData = false, url }, index) => {
          const legendColor = color ?? colors.next().value
          const isEmpty = noCommits || noData

          return (
            <StyledLegendItem
              color={noCommits ? 'var(--color-gray-200)' : legendColor}
              key={name}
              to={url}
            >
              <StyledLegendIcon
                color={legendColor}
                noMarginLeft={index === 0}
              />
              {
                isEmpty
                  ? (
                    <HelpPopover
                      content={<LegendEmptyMessage />}
                      placement='bottom'
                    >
                      {ellipsis(name, 30)}
                    </HelpPopover>
                    )
                  : (ellipsis(name, 30))
              }
            </StyledLegendItem>
          )
        })
      }
    </StyledLegend>
  )
}
