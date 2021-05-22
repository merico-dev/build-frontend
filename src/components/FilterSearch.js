import React, { useRef } from 'react'
import styled from '@emotion/styled'
import {
  FormControl,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core'
import { t } from '@lingui/macro'

import { ReactComponent as Search } from '@/icons/search.svg'
import { useI18n } from '@/utils/i18n'

const StyledOutlinedInput = styled(OutlinedInput)`
  max-width: 220px;
  .MuiOutlinedInput-notchedOutline {
    border-color: var(--color-primary-400);
    border-radius: var(--radius-xs);
    border-width: 1px;
  }
  &:hover {
    .MuiInputBase-input ~ .MuiOutlinedInput-notchedOutline {
      border-color: var(--color-primary-400);
    }
  }
  .MuiInputAdornment-root {
    color: var(--color-primary-400);
    cursor: pointer;
  }
  .MuiInputBase-input {
    color: var(--color-gray-400);
    &::placeholder {
      color: var(--color-gray-300);
      opacity: 1;
    }
  }
`

export default function FilterSearch (props) {
  const {
    children,
    className,
    onFilter,
    search,
    ...selectProps
  } = props

  const input = useRef()
  const i18n = useI18n()

  return (
    <FormControl className={className}>
      <StyledOutlinedInput
        placeholder={i18n._(t`Search`)}
        inputRef={input}
        endAdornment={(
          <InputAdornment position='end' onClick={() => onFilter(input.current)}>
            <Search width='14' height='14' />
          </InputAdornment>
        )}
        onKeyDown={(e) => e?.key === 'Enter' && onFilter(input.current)}
        aria-label='Search input'
        defaultValue={search}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...selectProps}
      />
    </FormControl>
  )
}
