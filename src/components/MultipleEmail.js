import React from 'react'
import styled from '@emotion/styled'
import { Button, makeStyles, TextField } from '@material-ui/core'

const StyledEmailList = styled.div`
  max-width: 100%;
`

const useStyle = makeStyles(() => ({
  textField: props => ({
    marginBottom: props.margin ? '20px' : '0'
  }),
  button: {
    width: '126px'
  }
}))

export default function MultipleEmails (props) {
  const {
    handleEmailChange,
    addEmptyEmail,
    emails = [],
    disabled = false,
    margin = true
  } = props

  const classes = useStyle({ margin })

  return (
    <>
      <StyledEmailList>
        {
        emails.map((email, index) => (
          <TextField
            // eslint-disable-next-line react/no-array-index-key
            key={`email_key_${index}`}
            className={classes.textField}
            type='email'
            id={`emails_${index}`}
            placeholder='Secondary email address'
            onChange={({ target }) => handleEmailChange && handleEmailChange(target.value, index)}
            value={email}
            fullWidth
            disabled={disabled}
          />
        ))
      }
      </StyledEmailList>
      {addEmptyEmail && (
        <Button
          color='primary'
          size='small'
          variant='contained'
          onClick={() => addEmptyEmail([''])}
          className={classes.button}
        >
          Add Another
        </Button>
      )}
    </>
  )
}
