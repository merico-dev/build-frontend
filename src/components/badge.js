import styled from '@emotion/styled'
import React from 'react'

import {
  Button,
  makeStyles,
  Tooltip,
  Typography
} from '@material-ui/core'
import { Link } from 'react-router-dom'

import { getRawIcon } from '@/utils/badges'
import { ReactComponent as Padlock } from '@/icons/padlock.svg'

const useStyles = makeStyles({
  tooltip: {
    border: '1px solid var(--color-gray-300)',
    padding: '16px',
    borderRadius: '6px',
    background: '#fff',
    color: 'inherit',
    width: '266px',
    margin: '4px 0 0 0',
    boxShadow: 'var(--elevation-1)'
  },
  h5: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--text-semibold)',
    margin: '0 0 0 0',
    color: 'var(--color-gray-400)'
  },
  body2: {
    fontSize: 'var(--text-xs)',
    color: 'var(--color-gray-400)'
  }
})

const StyledBadge = styled(Link)`
  display: block;
  font-size: var(--text-xxs);
  text-align: center;
  cursor: pointer;
  position: relative;

  &:hover {
    &:before {
      opacity: 1;
      box-shadow: var(--elevation-1);
    }
  }

  &:before {
    content: "";
    transition: opacity .3s;
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    box-shadow: var(--elevation-1);
    border-radius: var(--radius-md);
    pointer-events: none;
  }
`

const StyledBadgeImage = styled.img`
  display: block;
`

const StyledBadgeLocked = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 61px;
  width: 100%;
  color: var(--color-gray-400);
  background: rgba(255, 255, 255, 0.5);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledSvg = styled.svg`
  margin-right: 4.5px;
  color: var(--color-gray-400);
`

const StyledShareWrapper = styled.div`
  text-align: center;
  margin-top: 10px;
`

export default function Badge (props) {
  const {
    id,
    name,
    image,
    type,
    icon,
    description,
    locked,
    onBadgeShare
  } = props

  const rawIcon = getRawIcon(icon)

  const classes = useStyles()

  const badgeComponent = (
    <StyledBadge to={locked ? '/help' : `/badges/assertion/${id}`} disabled data-test='badge-assertion'>
      <StyledBadgeImage width='160' height='91' src={image} alt={`${name} badge`} />
      {locked && (
        <StyledBadgeLocked><Padlock width={24.75} height={28.12} /></StyledBadgeLocked>
      )}
    </StyledBadge>
  )
  if (locked) {
    return badgeComponent
  }

  return (
    <Tooltip
      content='Public repositories'
      title={(
        <div>
          <Typography variant='h5' className={classes.h5}>
            <StyledSvg
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: rawIcon }}
              width='14'
              height='14'
            />
            {type}
          </Typography>
          <Typography variant='body2' className={classes.body2}>{description}</Typography>
          {
            onBadgeShare && (
              <StyledShareWrapper>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => onBadgeShare && onBadgeShare({ id, imageUrl: image, description })}
                  size='small'
                >
                  Share
                </Button>
              </StyledShareWrapper>
            )
          }
        </div>
      )}
      placement='bottom-start'
      aria-label='Example'
      classes={{ tooltip: classes.tooltip }}
      interactive
    >
      {badgeComponent}
    </Tooltip>
  )
}
