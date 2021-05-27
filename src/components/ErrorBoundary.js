import React, { Component } from 'react'
import { Button, makeStyles, Typography } from '@material-ui/core'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

const StyledButtonContainer = styled.div`
  margin: 40px auto;
  padding: 0 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 185px;
`

const StyledErrorBoundary = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const StyledErrorBoundaryContent = styled.div`
  max-width: 505px;
`

const useStyles = makeStyles({
  title: {
    marginTop: 0
  },
  message: {
    fontSize: 'var(--text-md)',
    color: 'var(--color-gray-400)'
  },
  contactUs: {
    marginTop: '20px'
  }
})

function ErrorBoundaryContent (props) {
  const {
    style,
    cleanRoute,
    error,
    errorInfo
  } = props
  const classes = useStyles()

  return (
    <StyledErrorBoundary style={style}>
      <StyledErrorBoundaryContent>
        <Typography
          variant='h2'
          className={classes.title}
        >This is embarrassing :/
        </Typography>
        <Typography
          variant='body2'
          className={classes.message}
        >Sorry, this did not work. It&apos;s our fault. Here is what you can do:
        </Typography>
        <StyledButtonContainer>
          {
              cleanRoute
                ? (
                  <Button
                    color='primary'
                    variant='contained'
                    component={Link}
                    to={cleanRoute}
                  >Retry
                  </Button>
                  )
                : (
                  <Button
                    color='primary'
                    variant='contained'
                    onClick={() => window?.location?.reload()}
                  >Retry
                  </Button>
                  )
            }
          <Button
            color='primary'
            variant='contained'
            component={Link}
            to='/contact'
            className={classes.contactUs}
          >Contact Us
          </Button>
        </StyledButtonContainer>
        {
            process.env.NODE_ENV !== 'production' && (
              <details style={{ whiteSpace: 'pre-wrap' }}>
                {error && error.toString()}
                <br />
                {errorInfo?.componentStack}
              </details>
            )
          }
      </StyledErrorBoundaryContent>
    </StyledErrorBoundary>
  )
}

// eslint-disable-next-line react/prefer-stateless-function
export default class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      errorInfo: null
    }
  }

  componentDidCatch (error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })
  }

  render () {
    const {
      style,
      cleanRoute
    } = this.props
    const {
      error,
      errorInfo
    } = this.state
    if (this.state.errorInfo) {
      return (
        <ErrorBoundaryContent
          style={style}
          cleanRoute={cleanRoute}
          error={error}
          errorInfo={errorInfo}
        />
      )
    }

    return this.props.children
  }
}
