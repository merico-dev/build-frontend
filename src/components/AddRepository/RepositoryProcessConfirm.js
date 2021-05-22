import React from 'react'
import styled from '@emotion/styled'
import { Button } from '@material-ui/core'

const StyledProcessConfirm = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0 35px;
`

export default function RepositoryProcessConfirm (props) {
  const { addRepositoriesReponse, handleClose } = props
  return addRepositoriesReponse && (
    <StyledProcessConfirm>
      <div>
        <Button
          variant='contained'
          color='primary'
          onClick={handleClose}
        >OK
        </Button>
      </div>
    </StyledProcessConfirm>
  )
}
