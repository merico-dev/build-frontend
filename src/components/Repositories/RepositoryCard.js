import { Card, makeStyles, Typography } from '@material-ui/core'
import React from 'react'
import styled from '@emotion/styled'
import classNames from 'classnames'

import ProviderIcon from '@/components/Repositories/ProviderIcon'
import { humanPercentage } from '@/utils/numbers'
import { ellipsis } from '@/utils/string'
import { Plural } from '@lingui/macro'

const StyledRepositoryCardDetails = styled.div`
  display: grid;
  row-gap: 1px;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-top: 27px;
  grid-template-columns: 1fr 80px;
`

const StyledProviderIcon = styled(ProviderIcon)`
  margin-right: 7px;
`

const useStyles = makeStyles({
  card: {
    padding: '20px'
  },
  repositoryName: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 0 18px',
    textDecoration: 'none'
  },
  repositoryTitle: {
    fontSize: 'var(--text-md)',
    margin: '0 0 9px',
    fontWeight: 'var(--text-semibold)'
  },
  repositoryValue: {
    fontWeight: 'normal'
  },
  repositoryDetailText: {
    background: 'var(--color-background-600)'
  },
  repositoryDetailTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--text-semibold)',
    paddingLeft: '10px',
    display: 'flex',
    alignItems: 'center',
    height: '40px'
  },
  repositoryDetailPeriod: {
    textTransform: 'none',
    paddingLeft: '9px'
  },
  repositoryDetailValue: {
    paddingRight: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
})

const percentage = (value = 0) => (
  value ? Number(value.toFixed(2)) : 0
)

export default function RepositoryCard ({ repository }) {
  const classes = useStyles()

  if (!repository) return null

  return (
    <Card
      className={classes.card}
      component='article'
    >
      <Typography
        color='primary'
        variant='h1'
        component='a'
        href={repository.url}
        target='_blank'
        className={classNames(classes.repositoryTitle, classes.repositoryName)}
      >
        <StyledProviderIcon
          provider={repository.provider}
          width={19.23}
          height={18.72}
        />
        {ellipsis(repository.name)}
      </Typography>
      <Typography
        variant='h2'
        align='center'
        className={classes.repositoryTitle}
      >
        My Dev Share
      </Typography>
      <Typography
        variant='body2'
        align='center'
        color='secondary'
        className={classNames(classes.repositoryTitle, classes.repositoryValue)}
      >
        {repository.dev_value ? `${humanPercentage(repository.dev_value)}%` : '0%'}
      </Typography>

      <Typography
        variant='body2'
        align='center'
      >
        Ranked #{repository.position} out of {repository.contributors}&nbsp;
        <Plural value={repository.contributors ?? 0} one='contributor' other='contributors' />
      </Typography>
      <StyledRepositoryCardDetails>
        <Typography
          variant='body2'
          className={classNames(classes.repositoryDetailTitle, classes.repositoryDetailText)}
          color='textSecondary'
        >
          Productivity
          <Typography
            variant='overline'
            className={classes.repositoryDetailPeriod}
          >
            All-Time
          </Typography>
        </Typography>
        <Typography
          variant='body2'
          align='right'
          className={classNames(classes.repositoryDetailText, classes.repositoryDetailValue)}
          color='textSecondary'
        >
          {repository.dev_equivalent} ELOC
        </Typography>

        <Typography
          variant='body2'
          className={classNames(classes.repositoryDetailTitle, classes.repositoryDetailText)}
          color='textSecondary'
        >
          Quality
          <Typography
            variant='overline'
            className={classes.repositoryDetailPeriod}
          >
            Most Recent
          </Typography>
        </Typography>
        <Typography
          variant='body2'
          align='right'
          className={classNames(classes.repositoryDetailText, classes.repositoryDetailValue)}
          color='textSecondary'
        >{percentage(repository.quality)}%
        </Typography>
      </StyledRepositoryCardDetails>
    </Card>
  )
}
