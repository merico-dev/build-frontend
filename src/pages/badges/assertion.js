import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Button, Card, makeStyles, Typography } from '@material-ui/core'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import { Helmet } from 'react-helmet'

import { smMedia } from '@/styles/snippets/responsive'
import ShareBadgeDialog from '@/components/ShareBadgeDialog'
import BadgeHistory from '@/components/BadgeHistory/BadgeHistory'
import { FETCH_ASSERTION } from '@/store/reducers/badges'
import FetchStatus from '@/components/FetchStatus'
import { SUCCEED } from '@/store/statusTypes'
import { MP, BadgeEvents } from '@/utils/mixpanel'
import config from '@config/resolveConfig'
import EmptyIcon from '@/components/EE/EmptyIcon'
import { getLinguistBadgeRank } from '@/utils/badges/linguist'

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 53px;

  ${smMedia(`
    display: grid;
    grid-template-columns: 160px 1fr;
  `)}
`

const StyledButtonContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
`

const StyledBadgeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  ${smMedia(`
    justify-content: flex-start;
  `)}
`

const StyledBadgeHistory = styled(BadgeHistory)`
  margin: 22px 0 0;
`

const StyledReadMore = styled.div`
  text-align: center;
  margin-bottom: 37px;
`

const getAssertionTo = (user) => {
  if (user.displayName) {
    return user.displayName
  }
  if (user.githubUsername) {
    return user.githubUsername
  }
  if (user.gitlabUsername) {
    return user.gitlabUsername
  }
  return 'Anonymous'
}

const LinkStyle = `
color: var(--color-gray-500);
text-decoration: none;
border-bottom: 1px solid;
`

const StyledReadMoreLink = styled(Link)(LinkStyle)
const StyledLink = styled.a(LinkStyle)

const useStyles = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    fontSize: 'var(--text-xxl)',
    marginBottom: '5px'
  },
  container: {
    padding: '15px 25px 25px',
    maxWidth: '1000px',
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {
      padding: '40px 100px'
    }
  },
  containerCentered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  intro: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  classifierTitle: {
    fontWeight: 'var(--text-semibold)',
    fontSize: 'var(--text-md)',
    margin: '0 0 10px 0',
    color: 'var(--color-primary-400)'
  },
  classifierText: {
    display: 'inline-block',
    margin: '0 0 20px 0',
    color: 'var(--color-gray-500)'
  },
  updatedAt: {
    marginTop: '34px',
    textAlign: 'right',
    color: 'var(--color-gray-400)'
  }
}))

export default function Assertion () {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const {
    id
  } = useParams()
  const {
    status,
    data: assertion
  } = useSelector((state) => state.badges.assertion)
  useEffect(() => {
    dispatch({ type: FETCH_ASSERTION, payload: id })
    if (assertion) {
      MP.track(
        BadgeEvents.VIEW_BADGE,
        {
          Badge: assertion.name,
          Description: assertion.description,
          Grade: assertion.grade?.toUpperCase(),
          Type: assertion.BadgeType.code?.toUpperCase(),
          'Earned Date': assertion.createdAt,
          Project: assertion.project
        }
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch])
  const classes = useStyles()
  const handleOpenShare = () => {
    setOpen(true)
    MP.track(BadgeEvents.CLICKED_SHARE_DIALOG, {})
  }

  const tempBadgePointerPosition = (grade) => {
    let currentPosition = 50
    switch (grade.toString().toLowerCase()) {
      case 'iron':
        currentPosition = 25 + (80 / 2)
        break
      case 'bronze':
        currentPosition = 15 + (50 / 2)
        break
      case 'silver':
        currentPosition = 5 + (25 / 2)
        break
      case 'gold':
        currentPosition = 10 / 2
        break
      case 'tin':
      default:
        currentPosition = 90
        break
    }
    return currentPosition
  }

  if (status !== SUCCEED) {
    return (
      <Card className={classes.container}>
        <FetchStatus status={status} />
      </Card>
    )
  }

  if (!assertion?.id || assertion.grade === 'NONE') {
    return (
      <Card className={[classes.container, classes.containerCentered]}>
        <EmptyIcon width={70} height={70} />
        <Typography variant='h3'>Unable to find requested badge.</Typography>
      </Card>
    )
  }

  const assertionLink = `${config.frontendUrl}/badges/assertion/${assertion.id}`
  const language = assertion?.name?.replace('Linguist for ', '')

  return (
    <>
      <Helmet>
        <title>{`Merico Build - ${assertion.BadgeType.title}`}</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='MericoDev' />
        <meta property='og:title' content={`Merico Build - ${assertion.BadgeType.title}`} />
        <meta property='og:type' content='website' />
        <meta property='og:image' content={assertion.image} />
        <meta property='og:url' content={assertionLink} />
        <meta property='og:description' content={assertion.description} />
        <meta property='og:locale' content='en_US' />
        <meta property='og:site_name' content='Merico Build' />
      </Helmet>
      <Card className={classes.container}>
        <Typography variant='h1' className={classes.title}>
          {assertion?.BadgeType?.title}
        </Typography>
        <StyledReadMore>
          <StyledReadMoreLink to='/help#badges'>Learn more</StyledReadMoreLink>
        </StyledReadMore>
        <StyledContent>
          <StyledBadgeContainer>
            <img src={assertion.imageUrl} alt='Badge' />
          </StyledBadgeContainer>
          <div>
            <div>
              <Typography variant='h5' className={classes.classifierTitle}>Issued to</Typography>
              <Typography variant='body1' className={classes.classifierText}>{getAssertionTo(assertion?.User)}</Typography>
              <Typography variant='h5' className={classes.classifierTitle}>Issued by</Typography>
              <Typography
                variant='body1'
                className={classes.classifierText}
              >
                <StyledLink href={config.frontendUrl}>Merico Build</StyledLink>
              </Typography>
              <Typography variant='h5' className={classes.classifierTitle}>Description</Typography>
              <Typography variant='body1' className={classes.classifierText}>{assertion.description}</Typography>
              <Typography variant='h5' className={classes.classifierTitle}>Criteria</Typography>
              <Typography variant='body1' className={classes.classifierText}>{assertion?.BadgeType?.criteria}</Typography>
              <StyledBadgeHistory
                current={
                    assertion?.BadgeType?.code === 'linguist'
                      ? getLinguistBadgeRank(assertion?.rankNumerator, language)
                      : tempBadgePointerPosition(assertion.grade)
                }
                grade={assertion.grade}
              />
            </div>
          </div>
        </StyledContent>
        <Typography vairant='body1' className={classes.updatedAt}>
          Last updated:&nbsp;
          {DateTime.fromISO(assertion.updatedAt).toLocaleString(DateTime.DATETIME_SHORT)}
        </Typography>
        <StyledButtonContainer>
          <Button variant='contained' color='primary' onClick={handleOpenShare}>Share</Button>
        </StyledButtonContainer>
      </Card>
      <ShareBadgeDialog
        open={open}
        id={id}
        badgeImage={assertion.imageUrl}
        handleClose={() => setOpen(false)}
        badgeTitle={assertion.description}
      />
    </>
  )
}
