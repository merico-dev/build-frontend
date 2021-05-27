import React, { useEffect, useState } from 'react'
import {
  Checkbox,
  CircularProgress,
  makeStyles,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { ReadinessStatusReverseMap } from '@/enums/repositoryReadiness'
import { ANALYZE_REPO, DELETE_REPOSITORY } from '@/store/reducers/repositories'
import { SUCCEED } from '@/store/statusTypes'
import { MP, RepositoryEvents } from '@/utils/mixpanel'
import { DateTime } from 'luxon'
import { ReactComponent as Reload } from '@/icons/reload.svg'
import { ReactComponent as Chart } from '@/icons/chart.svg'
import { ReactComponent as Trash } from '@/icons/trash.svg'
import styled from '@emotion/styled'
import { useHistory } from 'react-router-dom'
import { deleteData } from '@/utils/fetchData'
import { isNextGenEnabled } from '@/utils/nextGen/featureFlag'

const useStyles = makeStyles({
  tooltip: {
    border: 'none',
    padding: '3px 5px 4px',
    borderRadius: 'var(--radius-xs)',
    color: 'var(--color-gray-400)',
    background: '#fff',
    margin: '5px 0 0 0',
    boxShadow: 'var(--elevation-1)',
    fontSize: 'var(--text-xs)'
  },
  checkbox: {
    margin: 0,
    padding: 0
  }
})

const StyledActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const StyledAction = styled.div`
  color: var(--color-primary-400);
  cursor: pointer;
  margin-right: 25px;
`

export default function RepositoryListActions (props) {
  const {
    list,
    repository,
    repositoriesToDelete = [],
    handleRepositoryCheck
  } = props
  const history = useHistory()
  const classes = useStyles()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const [analyzing, setAnalyzing] = useState([])
  const [deletingRepository, setDeletingRepository] = useState(false)

  useEffect(() => {
    if (list.status !== SUCCEED) {
      return
    }

    setAnalyzing([])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list])

  const handleRunAnalysis = () => {
    setAnalyzing((repositories) => {
      return [...repositories, repository.gitUrl]
    })
    dispatch({ type: ANALYZE_REPO, payload: repository })
    MP.track(
      RepositoryEvents.RUN_ANALYSIS,
      { Repository: repository.gitUrl, 'Started At': DateTime.utc().toString() }
    )
  }

  const viewProjectProfile = () => {
    let pppPath = '/projects/repository/overview'
    if (!isNextGenEnabled()) {
      pppPath = '/repository/overview'
    }
    history.push(`${pppPath}?gitUrl=${repository.gitUrl}`)
  }

  const deleteRepository = async () => {
    setDeletingRepository(true)
    try {
      await deleteData(`project?gitUrl=${repository.gitUrl}`)
      dispatch({ type: DELETE_REPOSITORY, payload: { gitUrl: repository.gitUrl } })
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Unable to delete repository:', e)
      setDeletingRepository(false)
    }
  }

  const canRunAnalysis = ![
    ...ReadinessStatusReverseMap.ongoing
  ].includes(repository.status) && !analyzing.includes(repository.gitUrl)

  return (
    <StyledActions>
      <StyledAction>
        <Tooltip
          title='View Public Project Profile'
          placement='bottom'
          classes={{ tooltip: classes.tooltip }}
        >
          <div>
            <Chart
              width='18'
              height='16'
              onClick={viewProjectProfile}
            />
          </div>
        </Tooltip>
      </StyledAction>
      <StyledAction>
        <Tooltip
          title={canRunAnalysis ? 'Re-run Analysis' : 'Restart Analysis'}
          placement='bottom'
          classes={{ tooltip: classes.tooltip }}
        >
          <div>
            <Reload
              width='17.19'
              height='16.67'
              onClick={() => !deletingRepository && handleRunAnalysis()}
            />
          </div>
        </Tooltip>
      </StyledAction>
      <StyledAction>
        <Tooltip
          title='Delete'
          placement='bottom'
          classes={{ tooltip: classes.tooltip }}
        >
          <div>
            {
            deletingRepository
              ? (
                <CircularProgress size={16.5} color='primary' />
                )
              : (
                <Trash
                  width='16.5'
                  height='17.19'
                  onClick={deleteRepository}
                  data-test='delete-repository'
                />
                )
            }
          </div>
        </Tooltip>
      </StyledAction>
      <Checkbox
        size={isLgUp ? 'medium' : 'small'}
        color='primary'
        checked={repositoriesToDelete.includes(repository.gitUrl)}
        onChange={(e) => handleRepositoryCheck(e, repository.gitUrl)}
        data-test='check-repository'
        className={classes.checkbox}
      />
    </StyledActions>
  )
}
