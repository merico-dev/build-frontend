import React from 'react'
import { Plural, Trans } from '@lingui/macro'

import { makeStyles, Typography, withStyles } from '@material-ui/core'
import { getColorGenerator } from 'charts'
import styled from '@emotion/styled'
import { colorSet } from '@/enums/colors'
import HeatBar from '@/components/HeatBar'
import { lgMedia } from '@/styles/snippets/responsive'
import { useTotalCommits } from '@/utils/repositories'
import { Link } from 'react-router-dom'

const StyledHeatBar = styled(HeatBar)`
  margin-left: auto;
  margin-right: auto;
  transform: translateX(-20px);
`

const StyledTypography = withStyles({
  h3: {
    marginBottom: '39px'
  }
})(Typography)

const StyledRepositoryTitle = styled(Link)`
  display: block;
  text-decoration: none;
  font-size: var(--text-md);
  max-width: 100%;
  text-align: center;
  color: ${({ color }) => color ?? 'var(--color-gray-400)'};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: var(--text-semibold);
  margin-bottom: 25px;
`

const StyledRepositoryText = styled.div`
  font-size: var(--text-md);
  max-width: 100%;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-weight: inherit;
  color: var(--color-gray-400);
`

const StyledRepositoryList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  row-gap: 35px;
`

const StyledRepository = styled.div`
  padding: 0 10px;
  max-width: 170px;
  ${({ total }) => total && lgMedia(`max-width: calc(100%/${total});`)}
`

const StyledRepositoryEmpty = styled.div`
  color: var(--color-gray-400);
  font-size: var(--text-xs);
  display: block;
  font-size: var(--text-xs);
  height: 238px;
  align-items: center;
  justify-content: center;
  display: flex;
  max-width: 147px;
  margin: auto;
  flex-direction: column;
`
const StyledRankingLink = styled(Link)`
  text-decoration: none;
  color: var(--color-primary-400);
  font-size: 12px;
  line-height: 18px;
  display: flex;
  justify-content: center;
  cursor: pointer;
`

const StyledLink = styled(Link)`
  color: var(--color-primary-400);
`

const useStyles = makeStyles({
  h4: {
    margin: '0 0 10px 0'
  }
})

const RankingEmpty = ({ totalCommits }) => {
  const classes = useStyles()
  return (
    <StyledRepositoryEmpty data-test='dev-value-ranking-empty'>
      <Typography
        variant='h4'
        color='primary'
        className={classes.h4}
      >No Data
      </Typography>
      <div>
        {totalCommits > 0
          ? (
              'No activity during the selected time range'
            )
          : (
            <>
              Your commits might be associated with different email addresses.
              You can add them in <StyledLink to='/account'>settings</StyledLink>.
            </>
            )}
      </div>
    </StyledRepositoryEmpty>
  )
}

const DevValueRankingRepository = (props) => {
  const {
    color,
    repository,
    total,
    filters
  } = props

  const totalCommits = useTotalCommits(repository.gitUrl)

  return (
    <StyledRepository key={repository.gitUrl} total={total} data-test={`ranking-item-${repository.name}`}>
      <StyledRepositoryTitle
        color={color}
        to={`/repository/overview?gitUrl=${repository.gitUrl}`}
      >{repository.name}
      </StyledRepositoryTitle>
      {repository.position !== 0
        ? (
          <StyledHeatBar
            max={repository.contributors}
            series={[
              { value: repository.position, label: repository.position, color }
            ]}
            height={200}
            barBackground='#F4F4F6'
            dataPointWidth={50}
            showAxisLabel={false}
            marginOffset={7}
            isRanking
          />
          )
        : (
          <RankingEmpty totalCommits={totalCommits} />
          )}
      <StyledRepositoryText>
        {repository.contributors}&nbsp;
        <Plural value={repository.contributors ?? 0} one='contributor' other='contributors' />
      </StyledRepositoryText>
      <StyledRankingLink to={{
        pathname: '/my-contributions/ranking',
        search: `?start=${filters?.startDate}&end=${filters?.endDate}&sort=impact&gitUrl=${repository?.gitUrl}`,
        state: { referrer: '/dashboard' }
      }}
      >
        View Full Ranking
      </StyledRankingLink>
    </StyledRepository>
  )
}

export default function DevValueRanking (props) {
  const {
    repositories,
    filters
  } = props
  const colors = getColorGenerator(null, colorSet)
  return (
    <>
      <StyledTypography variant='h3'><Trans>My Dev Share Ranking</Trans></StyledTypography>
      <StyledRepositoryList>
        {
          repositories.map((repository) => {
            const color = repository?.color ?? colors.next().value
            return (
              <DevValueRankingRepository
                color={color}
                repository={repository}
                key={repository.gitUrl}
                total={repositories.length}
                filters={filters}
              />
            )
          })
        }
      </StyledRepositoryList>
    </>
  )
}
