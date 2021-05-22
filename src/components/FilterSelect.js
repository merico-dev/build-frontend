import React from 'react'
import styled from '@emotion/styled'
// import { Select } from '@material-ui/core';
import Select, { components } from 'react-select'
import { ReactComponent as Arrow } from '@/icons/arrow.svg'
import scrollbar from '@/styles/snippets/scrollbar'
import svg from '@/icons/sandclock.svg'

const FILTER_TEXT_COLOR = 'var(--color-gray-400)'

const valueStyles = {
  fontSize: '1.125‬rem',
  color: FILTER_TEXT_COLOR,
  height: '26px',
  top: 0,
  transform: 'none',
  display: 'flex',
  alignItems: 'center',
}

const FilterSelectStyles = (override) => ({
  option: (provided, state) => {
    const optionStyles = {
      ...provided,
      position: 'relative',
      fontSize: '1.125‬rem',
      transition: 'background-color .3s',
      backgroundColor: state.isFocused ? '#FFF3EB' : 'transparent',
      border: 'none',
      color: state.isDisabled ? 'var(--color-gray-200)' : FILTER_TEXT_COLOR,
      padding: '8px 10px',
      ':active': {
        backgroundColor: 'var(--color-primary-100)',
      },
    }

    if (state.isDisabled) {
      optionStyles[':after'] = {
        content: '""',
        width: '11.39px',
        height: '14.06px',
        display: 'block',
        position: 'absolute',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundImage: `url('${svg}')`,
        ...(override?.option?.[':after'] || {})
      }
    }

    return optionStyles
  },
  menu: (provided) => ({
    ...provided,
    fontSize: '1.125‬rem',
    margin: '-1px 0 0 0',
    color: FILTER_TEXT_COLOR,
    borderRadius: '0 0 var(--radius-xs) var(--radius-xs)',
    boxShadow: 'none',
    border: '1px solid var(--color-primary-400)',
    borderTop: 0
  }),
  control: (provided, state) => ({
    ...provided,
    fontSize: '1.125‬rem',
    width: state.props?.width,
    height: '28px',
    minHeight: '28px',
    color: FILTER_TEXT_COLOR,
    boxShadow: 'none',
    outline: 0,
    borderRadius: state.isFocused ? 'var(--radius-xs) var(--radius-xs) 0 0' : 'var(--radius-xs)',
    border: '1px solid var(--color-primary-400)',
    '&:hover': {
      border: '1px solid var(--color-primary-500)',
    },
    ...override.control
  }),
  singleValue: (provided) => ({
    ...provided,
    ...valueStyles
  }),
  valueContainer: (provided) => ({
    ...provided,
    ...valueStyles
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    transform: state.selectProps.menuIsOpen ? 'scaleY(-1)' : '',
    padding: 0
  }),
  menuList: (provided) => ([provided, scrollbar({ width: '7px' })])
})

const StyledArrow = styled(Arrow)`
margin: 0 8px 0 4px;
color: var(--color-primary-400);
`

const DropdownIndicator = (props) => {
  return (
    // eslint-disable-next-line
    <components.DropdownIndicator {...props}>
      <StyledArrow width='10' height='8' />
    </components.DropdownIndicator>
  )
}

const StyledFilterSelectRepositories = styled.span`
  transform: translate(0, -4px);
`

export default function FilterSelect (props) {
  const {
    value,
    defaultValue,
    setValue,
    options,
    width = '360px',
    className,
    selectProps = {},
    customStyles = {},
    multiple = false,
  } = props

  const customComponents = {
    DropdownIndicator,
    IndicatorSeparator: null
  }

  if (multiple) {
    customComponents.ClearIndicator = null
    customComponents.ValueContainer = ({ children, ...componentProps }) => {
      const {
        getValue,
        hasValue
      } = componentProps
      const selectedTotal = getValue().length

      if (!hasValue) {
        return (
          <components.ValueContainer {...componentProps}>
            {children}
          </components.ValueContainer>
        )
      }

      // this is needed for clicking outsite the arrow
      const inputSelector = children.map(
        (Child, idx) => Child?.props?.type === 'text'
          ? (
              React.cloneElement(Child, {
                readOnly: true,
                style: { pointerEvents: 'none' },
                key: idx
              })
            )
          : null
      )

      return (
        <components.ValueContainer
          {...componentProps}
        >
          <StyledFilterSelectRepositories>
            Repositories | {selectedTotal}
          </StyledFilterSelectRepositories>
          {inputSelector}
        </components.ValueContainer>
      )
    }
  }

  return (
    <div style={{ width }} data-test='filter-select'>
      <Select
        value={value}
        defaultValue={defaultValue}
        onChange={(value) => {
          setValue(value)
        }}
        options={options}
        styles={FilterSelectStyles(customStyles)}
        className={className}
        components={customComponents}
        isMulti={multiple}
      // eslint-disable-next-line react/jsx-props-no-spreading
        {...selectProps}
      />
    </div>
  )
}
