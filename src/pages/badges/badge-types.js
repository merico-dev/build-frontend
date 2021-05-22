import React from 'react'
import { css } from '@emotion/core'
import styled from '@emotion/styled'
import { Card, makeStyles, Typography } from '@material-ui/core'

import { lgMedia, mdMedia, smMedia } from '@/styles/snippets/responsive'
import { getRawIcon } from '@/utils/badges'

const StyledBadgeList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 40px;

  ${smMedia(css`
    grid-template-columns: repeat(2, 1fr);
  `)}

  ${mdMedia(css`
    grid-template-columns: repeat(3, 1fr);
  `)}

  ${lgMedia(css`
    grid-template-columns: repeat(4, 1fr);
  `)}

  @media screen and (min-width: 960px) and (max-width: 1075px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const StyledBadge = styled.article`
  background: #F4F4F6;
  padding: 30px 16px;
  border-radius: var(--radius-md);
  font-size: var(--text-xxs);
  color: var(--color-gray-400);
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

const StyledBadgeImage = styled.div`
  width: 100px;
  height: 100px;
  margin: auto;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledBadgeTitle = styled.h1`
  font-weight: 600;
  font-size: var(--text-md);
  line-height: 1.2;
  margin: 11px auto;
  max-width: 218px;
`

const useStyles = makeStyles({
  container: {
    padding: '32px',
  },
  title: {
    margin: '0 0 40px 0',
    textAlign: 'center'
  }
})

export default function BadgeTypes () {
  const classes = useStyles()
  const badgeTypes = [
    {
      name: 'Linguist',
      icon: ''
    },
    {
      name: 'Multilingual',
      icon: ''
    },
    {
      name: 'Trailblazer',
      icon: ''
    },
    {
      name: 'Top Contributor',
      icon: ''
    },
    {
      name: 'Contributor',
      icon: ''
    },
    {
      name: 'Minesweeper',
      icon: ''
    },
    {
      name: 'Test of Time',
      icon: ''
    }
  ]

  return (
    <>
      <Card className={classes.container}>
        <Typography variant='h2' className={classes.title}>Badge Types</Typography>
        <Typography variant='body1'>Some introductory text about badges.</Typography>
        <StyledBadgeList>
          {
            badgeTypes.map((badgeType, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <StyledBadge key={index}>
                  <StyledBadgeImage>
                    <svg
                    // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{ __html: getRawIcon(badgeType.icon) }}
                      width='14'
                      height='14'
                      transform='scale(4)'
                    />
                  </StyledBadgeImage>
                  <StyledBadgeTitle>{badgeType.name}</StyledBadgeTitle>
                </StyledBadge>
              )
            })
          }
        </StyledBadgeList>
      </Card>
    </>
  )
}
