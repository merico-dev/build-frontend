import React from 'react'
import styled from '@emotion/styled'
import {
  Typography,
  makeStyles
} from '@material-ui/core'

import { ReactComponent as Plus } from '@/icons/plus.svg'
import HelpPopover from '@/components/HelpPopover'

const StyledPageFilterRepositories = styled.div`
  display: flex;
  margin-bottom: 30px;
  color: var(--color-gray-400);
  font-size: var(--text-xs);
  align-items: center;
  flex-wrap: wrap;
`

const StyledRepositoriesLabel = styled.p`
  margin: 0 0 4px 0;
`

const StyledRepository = styled.div`
  background: #fff;
  border: 1px solid var(--color-gray-300);
  margin-left: 10px;
  padding: 0 6px;
  border-radius: var(--radius-md);
  height: 22px;
  display: inline-flex;
  align-items: center;
  margin-bottom: 4px;

  ${({ failed }) => (
    failed && `
      border-color: #e04e4e;
      color: #e04e4e;
    `
  )}
`

const StyledPlus = styled(Plus)`
  color: var(--color-gray-300);
  margin-left: 9px;
  transform: rotate(45deg);
  cursor: pointer;
`

const useStyles = makeStyles({
  clear: {
    cursor: 'pointer',
    margin: '0 0 4px 10px'
  }
})

export default function PageFilterRepositories (props) {
  const {
    repositoryList,
    removeRepository,
    clearList,
    errors = []
  } = props

  const classes = useStyles()

  const isDeleteEnabled = repositoryList?.length > 1

  return repositoryList
    ? (
      <StyledPageFilterRepositories>
        <StyledRepositoriesLabel>Repositories:</StyledRepositoriesLabel>
        {
        repositoryList.map(({ label, value }) => {
          const error = errors.find((errorItem) => errorItem?.meta?.gitUrl === value)
          if (error) {
            return (
              <HelpPopover key={value} content={error.error}>
                <StyledRepository failed={error}>
                  {label}
                  {isDeleteEnabled && <StyledPlus onClick={() => removeRepository(value)} width='10' height='10' />}
                </StyledRepository>
              </HelpPopover>
            )
          }

          return (
            <StyledRepository key={value}>
              {label}
              {isDeleteEnabled && <StyledPlus onClick={() => removeRepository(value)} width='10' height='10' />}
            </StyledRepository>
          )
        })
        }
        {repositoryList.length > 1 && (
          <Typography
            color='primary'
            onClick={clearList}
            className={classes.clear}
          >
            Clear
          </Typography>
        )}
      </StyledPageFilterRepositories>
      )
    : null
}
