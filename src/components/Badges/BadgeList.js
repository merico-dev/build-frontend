import React, { useMemo } from 'react'
import styled from '@emotion/styled'

import { smMedia } from '@/styles/snippets/responsive'
import { gradeOrder } from '@/enums/badge'
import Badge from '../badge'
import { makeStyles, Typography } from '@material-ui/core'
import { SUCCEED } from '@/store/statusTypes'

const StyledBadgeList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  ${smMedia(`
    justify-content: flex-start;
  `)}

  > div {
    margin: 0 20px 20px 0;
  }
`

const useStyles = makeStyles((theme) => ({
  h4: {
    display: 'block',
    margin: '20px 0 10px'
  }
}))

const listBadgesByGrade = (badges) => {
  const mappedBadges = badges.reduce((acc, cur) => {
    const currentGradeList = acc.get(cur.grade) || []
    acc.set(cur.grade, [...currentGradeList, cur])
    return acc
  }, new Map())

  const orderedMap = new Map(
    [
      ...gradeOrder.map((grade) => {
        if (mappedBadges.get(grade) && mappedBadges.get(grade).length > 0) {
          return [grade, mappedBadges.get(grade)]
        }

        return null
      }).filter((badges) => badges && badges.length)
    ]
  )

  return orderedMap
}

const listBadgesByProject = (badges) => {
  const mappedBadges = badges.reduce((acc, cur) => {
    if (!cur.Project) {
      const accGlobal = acc.get('Global') || []
      acc.set('Global', [...accGlobal, cur])
      return acc
    }

    const currentProjectList = acc.get(cur.Project.name) || []
    acc.set(cur.Project.name, [...currentProjectList, cur])

    return acc
  }, new Map())

  const globalBadges = mappedBadges.get('Global')
  mappedBadges.delete('Global')

  if (globalBadges?.length) {
    return new Map([
      ['Global', globalBadges],
      ...mappedBadges.entries()
    ])
  }

  return mappedBadges
}

function sortByGrade (badges) {
  // number each grade to it's order
  const numberedGrade = badges.map((badge) => ({
    ...badge,
    gradeIndex: gradeOrder.indexOf(badge?.grade)
  }))
  // sort by grade index
  numberedGrade.sort((a, b) => a.gradeIndex - b.gradeIndex)
  return numberedGrade
}

const sortBadges = (badges, sortBy) => {
  switch (sortBy) {
    case 'repositories':
      return listBadgesByProject(badges)
    case 'grading':
    default:
      return listBadgesByGrade(badges)
  }
}

function gradeTitle (grade) {
  switch (grade) {
    case 'GOLD':
      return 'Gold'
    case 'SILVER':
      return 'Silver'
    case 'BRONZE':
      return 'Bronze'
    case 'IRON':
      return 'Iron'
    case 'NONE':
      return 'Locked Badges'
    default:
      return grade
  }
}

export default function BadgeList (props) {
  const {
    badges,
    sortBy = 'grade',
    showTitles = true,
    onBadgeShare
  } = props
  const classes = useStyles()

  const sortedBadges = useMemo(
    () => (badges.status === SUCCEED ? sortBadges(badges.data, sortBy.value) : new Map()),
    [badges, sortBy]
  )

  return (
    <>
      {
        [...sortedBadges.keys()].map((badgeCategory) => {
          let link = null
          if (sortBy.value === 'repositories') {
            link = sortedBadges.get(badgeCategory)[0]?.Project?.gitUrl?.replace('git://', 'https://')
          }
          return (
            <div key={badgeCategory}>
              {
                showTitles && (
                  <Typography
                    variant='h4'
                    component={link && 'a'}
                    target={link && '_blank'}
                    href={link}
                    className={classes.h4}
                  >{(sortBy.value === 'repositories') ? badgeCategory : gradeTitle(badgeCategory)}
                  </Typography>
                )
              }
              <StyledBadgeList>
                {sortByGrade(sortedBadges.get(badgeCategory)).map((badge) => (
                  <div key={badge.id}>
                    <Badge
                      name={badge.name}
                      image={badge.imageUrl}
                      icon={badge?.BadgeType?.icon}
                      description={badge.description}
                      type={badge?.BadgeType?.title}
                      locked={badge.grade === 'NONE'}
                      id={badge.id}
                      onBadgeShare={onBadgeShare}
                    />
                  </div>
                ))}
              </StyledBadgeList>
            </div>
          )
        })
      }
    </>
  )
}
