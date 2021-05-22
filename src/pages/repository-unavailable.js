import React, { useEffect, useRef, useState } from 'react'
import { ClassNames } from '@emotion/core'
import styled from '@emotion/styled'
import { Helmet } from 'react-helmet'
import {
  Button,
  Typography,
  makeStyles
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Trans } from '@lingui/macro'

import Panel from '@/layouts/Panel'
import { lgMedia, mdMedia, smMedia } from '@/styles/snippets/responsive'
import AddRepositoryDialog from '@/components/AddRepositoryDialog'
import RadialProgress from '@/components/RadialProgress'
import { Readiness } from '@/enums/repositoryReadiness'
import { FETCH_LIST } from '@/store/reducers/repositories'

const StyledContent = styled.div`
  ${({ isUnderway }) => (isUnderway
    ? `
      display: grid;
      grid-template-columns: 1fr;
      gap: 57px;
    `
    : ''
  )}
  margin: 0;
  ${smMedia(`
    margin: auto;
    grid-template-columns: 300px 1fr;
  `)}
`

const StyledButtons = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > button, > a {
    margin: 0 15px 15px 0;
  }

  ${smMedia(`
    margin-top: 76px;
  `)}
  ${lgMedia(`
    display: block;

    > button, > a {
      margin-bottom: 0;
    }
  `)}
`

const useStyles = makeStyles((theme) => ({
  button: {
    width: '240px',
    '&:first-of-type': {
      marginRight: '25px',
    }
  },
  body1: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-400)',
    [theme.breakpoints.up('sm')]: {
      fontSize: 'var(--text-md)',
    }
  },
  h2: {
    margin: '0 0 10px 0',
    fontSize: 'var(--text-md)',
    [theme.breakpoints.up('sm')]: {
      margin: '0 0 71px 0',
      fontSize: theme.typography.h2.fontSize
    }
  }
}))

const StyledEstimatedRemaining = styled.div`
  text-align: center;
  font-size: var(--text-md);
  color: var(--color-gray-400);
  position: relative;
`

const StyledEstimatedRemainingText = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
`

const StyledEstimatedTime = styled.div`
  font-size: var(--text-xxxl);
  font-weight: var(--text-semibold);
`

const AddRepository = ({ title, onClick }) => {
  const classes = useStyles()
  return (
    <Button
      variant='contained'
      color='primary'
      onClick={onClick}
      className={classes.button}
    >
      {title}
    </Button>
  )
}

const GoToRepositories = () => {
  const classes = useStyles()
  return (
    <Button
      variant='contained'
      color='primary'
      component={Link}
      to='/repositories'
      className={classes.button}
    >
      <Trans>Go to Repositories</Trans>
    </Button>
  )
}

const EstimatedRemaining = ({ repository }) => {
  const processed = (repository.progress) ? Number((repository.progress * 100).toFixed(1)) : 0
  return (
    <StyledEstimatedRemaining>
      <StyledEstimatedRemainingText>
        <Trans>Total processed:</Trans>
        <StyledEstimatedTime>{processed}%</StyledEstimatedTime>
      </StyledEstimatedRemainingText>
      <RadialProgress progress={processed} />
    </StyledEstimatedRemaining>
  )
}

export default function RepositoryUnavailable (props) {
  const {
    repositories = []
  } = props
  const classes = useStyles()

  const poolingInterval = useRef()

  const dispatch = useDispatch()
  const [repositoryDialog, setRepositoryDialog] = useState(false)

  const handleOpenRepositoryDialog = () => {
    setRepositoryDialog(true)
  }
  const handleCloseRepositoryDialog = () => {
    setRepositoryDialog(false)
    dispatch({ type: FETCH_LIST })
  }
  const singleRepository = repositories.length === 1
  const hasUnderway = repositories.some((repository) => repository.status === Readiness.UNDERWAY)

  const singleUnderway = singleRepository && (
    repositories[0].status === Readiness.UNDERWAY
  )
  const multipleUnderway = !singleRepository && hasUnderway
  const noProcessableRepo = !singleRepository && !hasUnderway

  const UnavailableMessage = ({ title, children }) => {
    return (
      <div>
        <Typography className={classes.h2} variant='h2'>
          {title}
        </Typography>
        <Typography className={classes.body1} variant='body1'>
          {React.Children.map(children, (children) => children)}
        </Typography>
        <StyledButtons>
          <AddRepository title='Add Another Repository' onClick={handleOpenRepositoryDialog} />
          <GoToRepositories />
        </StyledButtons>
      </div>
    )
  }

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (singleUnderway) {
      poolingInterval.current = window.setInterval(() => {
        dispatch({ type: FETCH_LIST })
      }, 5000)

      return () => {
        window.clearInterval(poolingInterval.current)
      }
    }
  }, [dispatch, singleUnderway])

  return (
    <>
      <ClassNames>
        {({ css }) => (
          <Panel ContentClassname={css`
          padding: 30px 23px;
          ${mdMedia('padding: 40px 50px;')}
        `}
          >
            <Helmet>
              <title>Repositories - Merico Build</title>
            </Helmet>
            <StyledContent isUnderway={singleUnderway}>
              {
                singleUnderway
                  ? (
                    <EstimatedRemaining repository={repositories[0]} />
                    )
                  : null
              }
              {
                singleUnderway && (
                  <UnavailableMessage title='Your first repository is being processed.'>
                    We will notify you when it&apos;s ready!
                    Meanwhile, you can add more repositories for processing.
                  </UnavailableMessage>
                )
              }
              {
                multipleUnderway && (
                  <UnavailableMessage title='Your repositories are being processed.'>
                    Processing takes between a few minutes and a few hours.
                    (Up to a day for the biggest repositories)!
                    Please come back to check later.
                  </UnavailableMessage>
                )
              }
              {
                noProcessableRepo && (
                  <UnavailableMessage title='Please add your first repository.'>
                    There is nothing to see here.
                    Try adding a repository to see its analysis.
                  </UnavailableMessage>
                )
              }
            </StyledContent>
            <AddRepositoryDialog
              open={repositoryDialog}
              handleClose={handleCloseRepositoryDialog}
            />
          </Panel>
        )}
      </ClassNames>
    </>
  )
}
