/** @jsx jsx */
import { jsx } from '@emotion/core'
import { Suspense, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from '@emotion/styled'
import {
  Typography,
  TextField,
  FormControl,
  FormHelperText,
  Button,
  Box,
  Link as MuiLink,
  withStyles,
  makeStyles
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Panel from '@/layouts/Panel'
import PageLoading from '@/components/PageLoading'
import BackToDashboardLink from '@/components/BackToDashboardLink'
import { mdMedia } from '@/styles/snippets/responsive'
import { postData } from '@/utils/fetchData'

const StyledFormGrid = styled.form`
  display: flex;
  flex-direction: column;
  margin: 36px 0 73px;
  max-width: 815px;
  padding: 0 20px;

  ${mdMedia(`
    grid-template-areas: 'auto auto' 'error error' 'buttons buttons';
    column-gap: 93px;
    display: grid;
    grid-template-columns: 280px minmax(280px, 1fr);
    margin: 56px auto 73px;
    padding: 0 ;

  `)}
`

const StyledButtonList = styled.div`
  display: flex;
  justify-content: center;
  grid-area: buttons;
  margin-top: 40px;
  .MuiTypography-colorError + & {
    margin-top: 0;
  }
  ${mdMedia(`
    margin-top: 85px;
    .MuiTypography-colorError + & {
      margin-top: 0;
    }
  `)}
`

const StyledFieldset = styled.div`
  margin-bottom: 30px;
`

const StyledRequiredLabel = styled.div`
  font-size: 0.75rem;
  margin-top: 4px;
  color: var(--color-gray-400);

  span {
    color: red;
  }
`

const StyledMessage = withStyles((theme) => ({
  root: {
    marginTop: '30px',
    marginBottom: 0,
    '& .MuiOutlinedInput-root': {
      minHeight: '170px',
      padding: '3px 11px',

      [theme.breakpoints.up('md')]: {
        minHeight: '284px'
      }
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-secondary-500)'
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'var(--color-secondary-500)'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: '4px',
    },
    '& .MuiInputBase-input': {
      alignSelf: 'flex-start'
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(0, -30px) scale(0.75)'
    },
    '& legend': {
      display: 'none'
    }
  },
}))(TextField)

const StyledTypography = withStyles((theme) => ({
  h1: {
    marginBottom: '20px',
    color: 'var(--color-gray-400)',
  },
  [theme.breakpoints.up('md')]: {
    h1: {
      marginBottom: '45px'
    }
  }
}))(Typography)

const useStyles = makeStyles((theme) => ({
  errorMessage: {
    gridArea: 'error',
    marginBottom: '13px',
    [theme.breakpoints.up('md')]: {
      marginBottom: '58px'
    }
  }
}))

const StyledContainer = styled.div`
  padding: 0 20px;
  margin: 70px auto 0;
  max-width: 815px;
`

export default function Form () {
  const { replace } = useHistory()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [project, setProject] = useState('')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const isAuthenticated = useSelector((state) => state.user.status === 'SUCCEED')

  const classes = useStyles()

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await postData(
        '/email/send',
        {
          email,
          name,
          project,
          title,
          message
        }
      )
      replace('/contact/success')
    } catch (e) {
      setError('Something went wrong while sending your message, please try again in a few minutes.')
      setLoading(false)
    }
  }

  return (
    <Panel sidebar={false} isAuthenticated={isAuthenticated}>
      <Helmet>
        <title>Contact Us - Merico Build</title>
      </Helmet>
      <Suspense fallback={<PageLoading />}>
        {isAuthenticated && <BackToDashboardLink to='/dashboard'>Back to Dashboard</BackToDashboardLink>}
        <StyledContainer>
          <StyledTypography variant='h1'>Contact Us</StyledTypography>
          <StyledTypography variant='body1'>
            To engage with the user community,
            come by our &nbsp;<MuiLink href='https://github.com/merico-dev/community/discussions'>Github board</MuiLink>.
          </StyledTypography>
          <Box marginTop='25px'>
            <StyledTypography
              variant='body1'
            >
              You can also drop us a message below and we will get back to you soon!
            </StyledTypography>
          </Box>
          <StyledFormGrid
            onSubmit={handleFormSubmit}
          >
            <Box>
              <StyledFieldset>
                <FormControl fullWidth style={{ marginBottom: '14px' }}>
                  <TextField
                    type='email'
                    label='Email'
                    onChange={({ target }) => setEmail(target.value)}
                    value={email}
                    id='email'
                    autoFocus
                    required
                  />
                  <FormHelperText id='standard-weight-helper-text'>We don&apos;t send spam to our users</FormHelperText>
                </FormControl>
              </StyledFieldset>
              <StyledFieldset>
                <TextField
                  fullWidth
                  label='Name'
                  onChange={({ target }) => setName(target.value)}
                  value={name}
                  id='name'
                />
              </StyledFieldset>
              <StyledFieldset>
                <TextField
                  fullWidth
                  onChange={({ target }) => setProject(target.value)}
                  value={project}
                  label='Company/Project'
                  id='project'
                />
              </StyledFieldset>
              <StyledFieldset>
                <TextField
                  fullWidth
                  onChange={({ target }) => setTitle(target.value)}
                  value={title}
                  label='Message Title'
                  id='title'
                />
              </StyledFieldset>
            </Box>
            <Box>
              <StyledMessage
                name='message'
                id='message'
                required
                fullWidth
                multiline
                variant='outlined'
                label='Message'
                placeholder='Your message'
                InputLabelProps={{
                  shrink: true
                }}
                // TODO: add max length visualizer
                inputProps={{
                  maxLength: 2048
                }}
                onChange={({ target }) => setMessage(target.value)}
              >{message}
              </StyledMessage>
              <StyledRequiredLabel>
                <span>*</span> Required field
              </StyledRequiredLabel>
            </Box>
            {error && (
              <Typography variant='body1' color='error' className={classes.errorMessage}>
                {error}
              </Typography>
            )}
            <StyledButtonList>
              <Button
                variant='contained'
                color='primary'
                size='large'
                type='submit'
                disabled={loading}
              >Send
              </Button>
            </StyledButtonList>
          </StyledFormGrid>
        </StyledContainer>
      </Suspense>
    </Panel>
  )
}
