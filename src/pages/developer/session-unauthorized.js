/* eslint-disable max-len */
/** @jsx jsx */
import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useHistory } from 'react-router-dom'
import { jsx, css } from '@emotion/core'
import styled from '@emotion/styled'
import { makeStyles } from '@material-ui/core/styles'
import {
  Container
} from '@material-ui/core'
import { Helmet } from 'react-helmet'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import LinearProgress from '@material-ui/core/LinearProgress'
import Snackbar from '@material-ui/core/Snackbar'
import PageLoading from '@/components/PageLoading'
import { DateTime } from 'luxon'
import { ReactComponent as Logo } from '@/images/logo-beta.svg'
import { fetchData } from '@/utils/fetchData'

const StyledTitle = styled.h1`
  color: var(--color-gray-500);
  font-size: 2.45rem;
  margin: 110px 0 20px;
  font-weight: normal;
`

const StyledSubtitle = styled.div`
  color: var(--color-gray-500);
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 10px;
  text-align: left;
`

const DeveloperSessionUnauthorized = styled.div`
  margin: 0 auto;
  background-color: #f5f5f5;
  display: flex;
  width: 100%;
  min-height: 100vh;

  * {
    font-family: 'Ubuntu Mono', 'Source Code Pro', monospace;
    font-weight: normal;
  }

  h1, p {
    text-align: left;
  }
`

const useGridStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
}))

export default function SessionUnauthorized (props) {
  const {
    title,
    text,
    // location
  } = props

  const [openDeveloperNotice, setOpenDeveloperNotice] = React.useState(false)
  const [alertMessage, setAlertMessage] = useState('Waiting for Backend API to Restart')
  const [retryApi, setRetryApi] = useState(false)
  const [continueDisabled, setContinueDisabled] = useState(true)
  const history = useHistory()
  const destinationRoute = window.location.search.split('?')[1].split('=')[1]

  // const retryLog = new Map()
  const [retryLog, setRetryLog] = useState(new Map())
  const [retryCount, setRetryCount] = useState(0)
  const [retriesExceeded, setRetriesExceeded] = useState(false)
  const retryTimeout = useRef(0)
  const retryLimit = 100

  const gridClasses = useGridStyles()

  const continueDevelopment = (e) => {
    e.preventDefault()
    window.location.href = destinationRoute
    // history.push(`${destinationRoute}`)
  }

  const goBack = () => {
    history.goBack()
  }

  const cancelPolling = () => {
    console.log('>>> API CANCEL POLLING', retryTimeout)
    clearTimeout(retryTimeout.current)
  }

  const exceededRetryLimit = useCallback(() => {
    return retryCount >= retryLimit
  }, [retryCount, retryLimit])

  useEffect(() => {
    console.log('>>> API RETRY #', retryCount)
    if (exceededRetryLimit()) {
      console.log('>>> RETRY LIMIT REACHED!!! STOP POLLING')
      setRetriesExceeded(true)
    } else {
      setRetriesExceeded(false)
    }
  }, [retryCount, exceededRetryLimit])

  useEffect(() => {
    async function retry () {
      let userResponse
      try {
        userResponse = await fetchData('/me')
        setAlertMessage(`Backend API Response Recived User ID - ${userResponse.user.primaryEmail}`)
        setOpenDeveloperNotice(true)
        setContinueDisabled(false)
        clearTimeout(retryTimeout.current)
      } catch (e) {
        console.log('>> API Error!', e)
        setRetryLog(retryLog => retryLog.set(Date.now(), { time: Date.now(), response: userResponse, url: '/me', error: e }))
        setAlertMessage('Unable to fetch data from /me')
        setOpenDeveloperNotice(true)
        retryTimeout.current = setTimeout(() => {
          setRetryApi(true)
        }, 10000)
        setRetryCount(rC => rC + 1)
      }
    }

    if (!retriesExceeded) {
      retry()
    } else {
      setRetryApi(false)
      cancelPolling()
    }

    return () => {
      clearTimeout(retryTimeout.current)
      setRetryApi(false)
      // setRetryLog(new Map())
    }
  }, [retryApi, retriesExceeded])

  const ApiLogRows = Array.from(retryLog.values()).reverse().slice(0, 1).map((log, idx) => (
    <Grid key={`logkey_${idx}`} item xs={12}>
      <Paper className={gridClasses.paper} style={{ textAlign: 'left', fontSize: '11px', padding: '8px' }}>
        <img alt='' style={{ width: '16px', float: 'left', marginRight: '10px' }} src='data:image/svg+xmlbase64,PHN2ZyBoZWlnaHQ9IjUxMXB0IiB2aWV3Qm94PSIwIC01OCA1MTEuOTk5NCA1MTEiIHdpZHRoPSI1MTFwdCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtNTguODIwMzEyIDM5NS4yMDcwMzFoMzk0LjM1OTM3NmM0Ny40NzI2NTYgMCA3NS4zMjAzMTItNTMuNDEwMTU2IDQ4LjE0MDYyNC05Mi4zMzU5MzdsLTE5MS41NjY0MDYtMjc0LjMzOTg0NGMtMjYuMDkzNzUtMzcuMzcxMDk0LTgxLjQxNDA2Mi0zNy4zNzEwOTQtMTA3LjUxMTcxOCAwbC0xOTEuNTY2NDA3IDI3NC4zMzk4NDRjLTI3LjE3NTc4MSAzOC45MjU3ODEuNjcxODc1IDkyLjMzNTkzNyA0OC4xNDQ1MzEgOTIuMzM1OTM3em0wIDAiIGZpbGw9IiNmZjkyOWYiLz48cGF0aCBkPSJtMjA2Ljk3NjU2MiAyMjguMzEyNWM2NC4xNDA2MjYtNjcuNzU3ODEyIDc1LjM3MTA5NC0xNjcuNjY0MDYyIDc2LjI5Mjk2OS0yMjEuOTI5Njg4LTI3LjQ0NTMxMi0xMi40ODQzNzQtNjItNS4wOTc2NTYtODEuMDI3MzQzIDIyLjE0ODQzOGwtMTkxLjU2NjQwNyAyNzQuMzM5ODQ0Yy0yNy4xNzU3ODEgMzguOTI1NzgxLjY3MTg3NSA5Mi4zMzU5MzcgNDguMTQ0NTMxIDkyLjMzNTkzN2g4My44NzVjLS43OTI5NjgtNDMuMjg5MDYyIDkuMjc3MzQ0LTEwOC43OTI5NjkgNjQuMjgxMjUtMTY2Ljg5NDUzMXptMCAwIiBmaWxsPSIjZmY3MzdkIi8+PHBhdGggZD0ibTI1NiAyNTkuNTM1MTU2Yy0xNy45MTc5NjkgMC0zMi41NzgxMjUtMTQuNjYwMTU2LTMyLjU3ODEyNS0zMi41NzgxMjV2LTEzMC43MjI2NTZjMC0xNy45MjE4NzUgMTQuNjYwMTU2LTMyLjU4MjAzMSAzMi41NzgxMjUtMzIuNTgyMDMxczMyLjU3ODEyNSAxNC42NjAxNTYgMzIuNTc4MTI1IDMyLjU4MjAzMXYxMzAuNzIyNjU2YzAgMTcuOTE3OTY5LTE0LjY2MDE1NiAzMi41NzgxMjUtMzIuNTc4MTI1IDMyLjU3ODEyNXptMCAwIiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTI4OC4xNjc5NjkgMzIxLjUzMTI1YzAgMTcuNzY1NjI1LTE0LjQwMjM0NCAzMi4xNjQwNjItMzIuMTY3OTY5IDMyLjE2NDA2MnMtMzIuMTY3OTY5LTE0LjM5ODQzNy0zMi4xNjc5NjktMzIuMTY0MDYyIDE0LjQwMjM0NC0zMi4xNjc5NjkgMzIuMTY3OTY5LTMyLjE2Nzk2OSAzMi4xNjc5NjkgMTQuNDAyMzQ0IDMyLjE2Nzk2OSAzMi4xNjc5Njl6bTAgMCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0yNzcuNTE5NTMxIDcxLjgyNDIxOWMtNS43NS01LjA4MjAzMS0xMy4yODkwNjItOC4xNzE4NzUtMjEuNTE5NTMxLTguMTcxODc1LTE3LjkxNzk2OSAwLTMyLjU3ODEyNSAxNC42NjQwNjItMzIuNTc4MTI1IDMyLjU4MjAzMXYxMTIuNTUwNzgxYzMxLjcxNDg0NC00Mi4zMTI1IDQ2Ljk4NDM3NS05My4wMTk1MzEgNTQuMDk3NjU2LTEzNi45NjA5Mzd6bTAgMCIgZmlsbD0iI2NjZjhmZiIvPjwvc3ZnPg==' />
        <span style={{ fontWeight: 'bold', paddingRight: '10px' }}>{parseInt(DateTime.local().diff(DateTime.fromMillis(log.time), ['seconds']).seconds, 10)} seconds ago</span>
        <span>{log.error.message}</span>
      </Paper>
    </Grid>
  ))

  return (
    <DeveloperSessionUnauthorized>
      <Helmet>
        <title>{title} - Merico Build</title>
        <link rel='preconnect' href='https://fonts.gstatic.com' />
        <link href='https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,4000,7001,4001,700&display=swap' rel='stylesheet' />
      </Helmet>
      <Suspense fallback={<PageLoading />}>
        <Container css={css`
          padding: 70px 0 40px
          text-align: left
        `}
        >
          <Logo height='32' alt='Merico Build' style={{ display: 'block', margin: '36px auto' }} />
          <StyledTitle>
            {title}
          </StyledTitle>
          <div className={gridClasses.root}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper className={gridClasses.paper}>
                  <StyledSubtitle>{text}</StyledSubtitle>
                  <p>Authentication has failed because the backend server is unavailable or restarting.</p>

                  <Button
                    style={{ marginRight: '10px' }}
                    variant='contained'
                    color='primary'
                    onClick={(e) => continueDevelopment(e)}
                    disabled={continueDisabled}
                  >Continue Development
                  </Button>
                  <Button onClick={goBack} variant='outlined'>Go Back</Button>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <h6 style={{ margin: 0, padding: 0, lineHeight: '28px', fontSize: '13px', textAlign: 'left' }}>
                  {continueDisabled ? (<span><span style={{ color: 'rgb(255, 63, 63)', fontSize: '18px' }}> &#9888; </span> API Connection Offline</span>) : (<span><span style={{ color: 'rgb(144, 221, 66)', fontSize: '18px' }}> &#x2713; </span> API Connection Online</span>)}
                </h6>
                {continueDisabled && <LinearProgress color='secondary' />}
                {!continueDisabled && <LinearProgress variant='determinate' value={100} />}
                <Grid container spacing={3}>
                  {continueDisabled
                    ? ApiLogRows
                    : (
                      <Grid item xs={12}>
                        <Paper className={gridClasses.paper} style={{ textAlign: 'left', fontSize: '11px', padding: '8px' }}>
                          API Server Connection successful.
                        </Paper>
                      </Grid>
                      )}

                </Grid>
              </Grid>
              <Grid item xs={12} md={4} />
            </Grid>
          </div>

          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            open={openDeveloperNotice}
            autoHideDuration={7000}
            // onClose={handleClose}
            message={alertMessage}
            action={(
              <>
                <Button color='secondary' size='small' onClick={(e) => setOpenDeveloperNotice(false)}>
                  OK
                </Button>
              </>
            )}
          />
        </Container>
      </Suspense>
    </DeveloperSessionUnauthorized>
  )
}
