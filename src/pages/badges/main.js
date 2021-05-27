import React, { useCallback, useEffect, useState } from 'react'
import { Card, Typography, makeStyles, useMediaQuery, useTheme, Button } from '@material-ui/core'
import styled from '@emotion/styled'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import HelpPopover from '@/components/HelpPopover'
import FilterSelect from '@/components/FilterSelect'
import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import { FETCH_BADGES } from '@/store/reducers/badges'
import { SUCCEED } from '@/store/statusTypes'
import FetchStatus from '@/components/FetchStatus'
import { smMedia } from '@/styles/snippets/responsive'
import BadgeList from '@/components/Badges/BadgeList'
import BadgeGrades from '@/components/Badges/BadgeGrades'
import ShareBadgeDialog from '@/components/ShareBadgeDialog'

import { MP, BadgeEvents } from '@/utils/mixpanel'

const useStyles = makeStyles((theme) => ({
  subtitle: {
    marginTop: 0,
    paddingTop: '20px'
  },
  card: {
    padding: '10px',
    [theme.breakpoints.up('sm')]: {
      padding: '30px',
    }
  },
  firstCard: {
    marginBottom: '30px',
    minHeight: '160px'
  },
  pageDescription: {
    marginBottom: '25px',
    color: 'var(--color-gray-500)'
  }
}))

const StyledHeading = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 20px;
`

const StyledSort = styled.div`
  display: flex;
  font-size: var(--text-sm);

  > span:first-of-type {
    margin-right: 17px;
  }

  ${smMedia(`
    font-size: var(--text-md);
  `)}
`

const StyledExploreButton = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function Main () {
  const classes = useStyles()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isXsUp = useMediaQuery(theme.breakpoints.up('xs'))
  const options = [
    {
      value: 'grading',
      label: 'Grading'
    },
    {
      value: 'repositories',
      label: 'Repositories'
    }
  ]
  const [sortBy, setSortBy] = useState(options[0])
  const [open, setOpen] = useState(false)
  const [currentBadge, setCurrentBadge] = useState({})
  const {
    badges
  } = useSelector((state) => state.badges)

  useEffect(() => {
    dispatch({ type: FETCH_BADGES })
    MP.track(BadgeEvents.VIEW_ALL, { 'Badges Count': badges ? badges.length : 0 })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const openShareDialog = useCallback((badge) => {
    setOpen(true)
    setCurrentBadge(badge)
  }, [setOpen, setCurrentBadge])

  return (
    <>
      <Typography variant='h1'>
        Badges&nbsp;
        <HelpPopover
          content={`
            Merico Build provides badges to enable developers to communicate
            their accomplishments.
            They are intended to encourage learning, demonstrate skill,
            and encourage self-improvement.
          `}
          moreLink='/help#badges'
        >
          <QuestionCircle width='28' height='28' />
        </HelpPopover>
      </Typography>
      <Card className={classNames(classes.card, classes.firstCard)}>
        <StyledHeading>
          <Typography variant='h3'>My Badges</Typography>
          <StyledSort>
            <span>Sort by</span>
            <FilterSelect
              width={isXsUp ? 220 : 160}
              value={sortBy}
              setValue={setSortBy}
              options={options}
            />
          </StyledSort>
        </StyledHeading>
        {
          badges.status === SUCCEED
            ? (
              <>
                {
                sortBy.value === 'grading' && (
                  <BadgeGrades />
                )
              }
                <BadgeList
                  badges={badges}
                  sortBy={sortBy}
                  onBadgeShare={openShareDialog}
                />
              </>
              )
            : (
              <FetchStatus status={badges.status} />
              )
        }
      </Card>
      <StyledExploreButton to='/help#badges'>
        <Button
          variant='contained'
          color='primary'
        >Explore Badges
        </Button>
      </StyledExploreButton>
      <ShareBadgeDialog
        open={open}
        id={currentBadge?.id}
        badgeImage={currentBadge?.imageUrl}
        handleClose={() => setOpen(false)}
        badgeTitle={currentBadge?.description}
      />
    </>
  )
}
