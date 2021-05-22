import React from 'react'
import {
  makeStyles,
  Typography
} from '@material-ui/core'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import TopAchievementItem from '@/components/TopAchievements/TopAchievementItem'

const useStyles = makeStyles({
  h3: {
    fontSize: 'var(--text-xl)',
    color: 'var(--color-gray-500)',
    textAlign: 'center'
  },
  body2: {
    fontSize: 'var(--text-xs)',
    textAlign: 'center'
  }
})

const StyledAchievementsWrapper = styled.div`
  margin-top: 20px;
`

export default function TopAchievements (props) {
  const {
    achievements = [],
    showViewAll
  } = props
  const classes = useStyles()

  if (!achievements.length) {
    return null
  }

  return (
    <div>
      <Typography className={classes.h3} variant='h3'>Top Achievements</Typography>
      {
        showViewAll && (
          <Typography className={classes.body2} variant='body2' color='primary'>
            <Link to='/badges' style={{ color: 'inherit' }}>View all</Link>
          </Typography>
        )
      }
      <StyledAchievementsWrapper>
        {
          achievements.slice(0, 6).map(({ rankNumerator, name }) => {
            const language = name.replace('Linguist for ', '')
            return (
              <TopAchievementItem key={name} rankNumerator={rankNumerator} language={language} />
            )
          })
        }
      </StyledAchievementsWrapper>
    </div>
  )
}
