import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  makeStyles,
  Typography
} from '@material-ui/core'
import styled from '@emotion/styled'
import { getColorGenerator } from 'charts'

import CustomRadarChart from '@/components/CustomRadarChart/CustomRadarChart'
import FilterSelect from '@/components/FilterSelect'
import { colorSet } from '@/enums/colors'

const useStyles = makeStyles({
  chartTitle: {
    marginBottom: '27px'
  }
})

const StyledQualityComparator = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`

const StyledQualityComparatorItem = styled.div`
  font-size: var(--text-xs);
  color: var(--color-gray-400);
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`

const StyledQualitySquare = styled.div`
  width: 10px;
  height: 10px;
  border: 1px solid;
  background: rgba(248, 248, 250, 0.6);
  ${({ color }) => color ? `color: ${color};` : 'color: var(--color-gray-400);'}
  display: inline-block;
  transform: rotate(45deg);
  margin-right: 10px;
`

const StyledQualityComparison = styled.div`
  position: relative;
`

const StyledRepoName = styled.div`
  max-width: 140px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

function QualityComparator (props) {
  const {
    selectedProjects,
    projects = [],
    onProjectSelect
  } = props

  const colors = getColorGenerator(null, colorSet)

  const list = [
    ...selectedProjects
  ]
  if (list.length < 2) {
    list.push({ repoName: 'Median' })
  }

  const handleProjectSelect = (id, value) => {
    onProjectSelect(id, value)
  }

  const hasMoreThan2 = projects?.length > 2

  return (
    <StyledQualityComparator>
      {
        list.map((item, idx) => {
          const options = projects.map(({ gitUrl, repoName }) => ({
            value: gitUrl,
            label: repoName,
            isDisabled: selectedProjects.some(
              ({ gitUrl: selectedGitUrl }) => selectedGitUrl === gitUrl
            )
          }))

          return (
            <StyledQualityComparatorItem key={idx}>
              <StyledQualitySquare color={item?.color || colors.next().value} />
              {
                hasMoreThan2
                  ? (
                    <FilterSelect
                      width={140}
                      defaultValue={options.find(({ value }) => value === selectedProjects[idx]?.gitUrl)}
                      setValue={({ value }) => handleProjectSelect(idx, value)}
                      options={options}
                      customStyles={{
                        option: {
                          ':after': {
                            backgroundImage: 'none'
                          }
                        }
                      }}
                    />
                    )
                  : (
                    <StyledRepoName>
                      {item.repoName}
                    </StyledRepoName>
                    )
              }
            </StyledQualityComparatorItem>
          )
        })
      }
    </StyledQualityComparator>
  )
}

const MEDIAN = [
  { key: 'm2-1', name: 'Median', metric: 'docCoverage', metricName: 'Doc Coverage', value: 50 },
  { key: 'm2-2', name: 'Median', metric: 'reusability', metricName: 'Reusability', value: 50 },
  { key: 'm2-3', name: 'Median', metric: 'modularity', metricName: 'Modularity', value: 50 },
  { key: 'm2-4', name: 'Median', metric: 'testCoverage', metricName: 'Test Coverage', value: 50 },
]

export default function QualityComparison (props) {
  const {
    projects
  } = props

  const [selectedProjects, setSelectedProjects] = useState([])

  const classes = useStyles()

  useEffect(() => {
    if (projects?.data?.length > 1) {
      setSelectedProjects([
        projects.data[0],
        projects.data[1]
      ])
      return
    }

    if (projects?.data?.[0] && projects?.data?.[0]?.quality) {
      // select first repository
      setSelectedProjects([projects.data[0]])
    }
  }, [projects])

  const qualityData = useMemo(() => {
    // console.log('selectedProjects memo', selectedProjects)
    const quality = selectedProjects.map((project, index) => {
      if (!project?.quality) {
        return []
      }

      const {
        docCoverage = 0,
        codeReusability = 0,
        modularity = 0,
        staticTestCoverage = 0
      } = project?.quality

      return [
        { key: `${project.gitUrl}-1`, name: project.repoName, metric: 'docCoverage', metricName: 'Doc Coverage', value: docCoverage },
        { key: `${project.gitUrl}-2`, name: project.repoName, metric: 'reusability', metricName: 'Reusability', value: codeReusability },
        { key: `${project.gitUrl}-3`, name: project.repoName, metric: 'modularity', metricName: 'Modularity', value: modularity },
        {
          key: `${project.gitUrl}-4`, name: project.repoName, metric: 'testCoverage', metricName: 'Test Coverage', value: staticTestCoverage
        }
      ]
    })

    if (quality.length >= 2) {
      return quality.flat()
    }

    if (quality.length < 1) {
      return MEDIAN
    }

    return [
      ...quality[0],
      ...MEDIAN
    ]
  }, [selectedProjects])

  const handleProjectsChange = useCallback((index, gitUrl) => {
    setSelectedProjects((currentSelectedProjects) => {
      const newProject = projects?.data?.find((project) => project.gitUrl === gitUrl)
      // replace project
      if (newProject && currentSelectedProjects[index]) {
        currentSelectedProjects[index] = newProject
      }
      return [...currentSelectedProjects]
    })
  }, [projects, setSelectedProjects])

  return (
    <StyledQualityComparison>
      <Typography variant='h3' className={classes.chartTitle}>Quality</Typography>
      <QualityComparator
        selectedProjects={selectedProjects}
        projects={projects?.data}
        onProjectSelect={handleProjectsChange}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CustomRadarChart
          data={qualityData}
          customConfigurations={{ color: colorSet }}
        />
      </div>
    </StyledQualityComparison>
  )
}
