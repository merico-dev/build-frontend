/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import React from 'react'
import {
  Tooltip,
  Typography,
  withStyles
} from '@material-ui/core'
import { Link } from 'react-router-dom'

import {
  Trans
} from '@lingui/macro'

const StyledTooltip = withStyles({
  tooltip: {
    border: '2px solid var(--color-primary-400)',
    padding: '12px',
    borderRadius: '6px',
    background: '#fff',
    color: 'inherit',
    maxWidth: '180px'
  },
  tooltipPlacementTop: {
    margin: 0
  },
  tooltipPlacementRight: {
    margin: 0
  },
  tooltipPlacementLeft: {
    margin: 0
  },
  tooltipPlacementBottom: {
    margin: 0
  },
  arrow: {
    color: 'var(--color-primary-400)'
  }
})(Tooltip)

export default function HelpPopover (props) {
  const {
    moreLink,
    children,
    keepOpen,
    external,
    content,
    marginLeft,
    ...TooltipProps
  } = props

  const More = moreLink && (external
    ? (
      <a
        href={moreLink}
        css={css`
        color: var(--color-primary-400);
        text-decoration: none;
      `}
      >
        <Trans>Learn more</Trans>
      </a>
      )
    : (
      <Link
        css={css`
        color: var(--color-primary-400);
        text-decoration: none;
      `}
        to={moreLink}
      >
        <Trans>Learn more</Trans>
      </Link>
      ))

  return (
    <StyledTooltip
      title={(
        <div>
          <Typography variant='body2'>
            {content}
            {More && (<><br />{More}</>)}
          </Typography>
        </div>
    )}
      placement='top'
      interactive
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...TooltipProps}
    >
      <span style={{ marginLeft, lineHeight: 1 }}>
        {React.Children.map(children, (el) => el)}
      </span>
    </StyledTooltip>
  )
}
