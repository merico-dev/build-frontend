import React, { useCallback, useEffect, useState, useRef } from 'react'
import styled from '@emotion/styled'
import { Helmet } from 'react-helmet'
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  // Button
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'

import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import DetailsContent from '@/components/DetailsContent'
import DetailsHeading from '@/components/DetailsHeading'
import HelpPopover from '@/components/HelpPopover'
import { lgMedia, mdMedia } from '@/styles/snippets/responsive'
import useAllTimeFallback from '@/utils/useAllTimeFallback'

import {
  FETCH_OVERVIEW,
} from '@/store/reducers/quality'
import { humanPercentage } from '@/utils/numbers'
import ErrorBoundary from '@/components/ErrorBoundary'
import SingleLineChart from '@/components/SingleLineChart'
import QualityMixedGraph from '@/components/QualityMixedGraph'
import QualityDetailsGraph from '@/components/QualityDetailsGraph'
import { shouldShowVariation } from '@/utils/chart/variation'

// import GaugeChart from 'react-gauge-chart'
// import PageLoading from '@/components/PageLoading'

const StyledGraphGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;

  ${mdMedia(`
    grid-template-columns: repeat(2, 1fr);
  `)}

  ${lgMedia(`
    grid-template-columns: repeat(3, 1fr);
  `)}
`

const StyledQualityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;

  ${mdMedia(`
    grid-template-columns: repeat(1, 1fr);
  `)}

  ${lgMedia(`
    grid-template-columns: repeat(2, 1fr);
  `)}
`

// const StyledGuage = styled.div`
//   max-width: 520px;
//   justify-content: center;
//   width: 100%;
// `

// const StyledQualityScore = styled.div`
//   color: #717484;
//   text-align: center;
//   margin-bottom: 20px;
// `

export function Quality () {
  const dispatch = useDispatch()
  const {
    overview
  } = useSelector((state) => state.quality)
  const {
    setFilters,
    filters,
    defaultRange
  } = useAllTimeFallback({ overview })
  const QualityDetailsCardRef = useRef(null)
  const [redraw, setRedraw] = useState(false)

  const handleFilterChange = useCallback((payload) => {
    setFilters(payload)
    dispatch({ type: FETCH_OVERVIEW, payload })
  }, [dispatch, setFilters])

  // const [qualityScore, setQualityScore] = useState(0)

  const overviewData = overview?.data?.map((dataPoint) => {
    return {
      ...dataPoint,
      quality: Number(dataPoint.quality.toFixed(2)),
      doc_coverage: Number(dataPoint.doc_coverage.toFixed(2)),
      static_test_coverage: humanPercentage(dataPoint.static_test_coverage, 2),
      code_reusability: humanPercentage(dataPoint.code_reusability, 2),
      modularity: Number(dataPoint.modularity.toFixed(2))
    }
  })

  const qualityData = overview?.data?.map((dataPoint, idx) => {
    const name = dataPoint.project_id && dataPoint.project_id.length > 14
      ? dataPoint.project_id.substring(0, 11) + '...'
      : dataPoint.project_id
    return {
      ...dataPoint,
      name,
      quality: Number(dataPoint.quality.toFixed(2)),
    }
  })

  const extractQualityDetails = (data) => {
    const details = []
    const point = data !== undefined && data[0]
      ? data[0]
      : {
          doc_coverage: 0,
          static_test_coverage: 0,
          code_reusability: 0,
          modularity: 0,
        }
    details.push({ name: 'Doc Coverage', value: point.doc_coverage ?? 0 })
    details.push({ name: 'Test Coverage', value: point.static_test_coverage ?? 0 })
    details.push({ name: 'Reusability', value: point.code_reusability ?? 0 })
    details.push({ name: 'Modularity', value: point.modularity ?? 0 })
    return details
  }

  useEffect(() => {
    const resizeHandler = () => {
      setRedraw(drawing => !drawing)
    }
    window.addEventListener('resize', resizeHandler)
    return () => {
      window.removeEventListener('resize', resizeHandler)
      setRedraw(false)
    }
  }, [QualityDetailsCardRef])

  return (
    <DetailsContent onFilterChange={handleFilterChange} defaultRange={defaultRange}>
      <Helmet>
        <title>Ranking Details - Merico Build</title>
      </Helmet>
      <DetailsHeading>
        <Typography variant='h1'>
          Quality&nbsp;
        </Typography>
        <HelpPopover
          content={`
            Quality scores are a weighted blend of issue density, doc coverage,
            test coverage, reusability, and modularity.
          `}
          moreLink='/help#quality'
        >
          <IconButton
            size='small'
            aria-label='More information'
          >
            <QuestionCircle width='28' hight='28' />
          </IconButton>
        </HelpPopover>
      </DetailsHeading>
      <StyledQualityGrid>
        <Card style={{ marginBottom: '20px' }}>
          <CardContent>
            <Typography variant='h3' style={{ marginBottom: '30px' }}>
              Overview
            </Typography>
            <QualityMixedGraph isFetching={overview?.status !== 'SUCCEED'} data={qualityData} guageOnly />
          </CardContent>
        </Card>
        <Card style={{ marginBottom: '20px' }}>
          <CardContent style={{ padding: '20px' }}>
            <Typography variant='h3' style={{ marginBottom: '30px' }}>
              Details
            </Typography>
            <div ref={QualityDetailsCardRef}>
              <QualityDetailsGraph
                isFetching={overview?.status !== 'SUCCEED'}
                data={extractQualityDetails(overviewData)}
                redraw={redraw}
                width={QualityDetailsCardRef.current ? QualityDetailsCardRef.current.clientWidth : 320}
              />
            </div>
          </CardContent>
        </Card>
      </StyledQualityGrid>
      <Typography variant='h2' style={{ marginTop: '40px' }}>Components</Typography>
      <StyledGraphGrid>
        <Card>
          <CardContent>
            <SingleLineChart
              title='Doc Coverage'
              data={overviewData || []}
              valueKey='doc_coverage'
              status={overview.status}
              gitUrls={[filters?.gitUrl]}
              dateKey='create_time'
              yAxis={{
                label: {
                  title: 'Functions with documentation (%)',
                  helpText: `
                    Doc-Coverage provides a metric to benchmark the percentage of functions
                    that are documented with comments.
                  `,
                  helpLink: '/help#doc-coverage'
                }
              }}
              featured
              variant='sm'
              showVariation={shouldShowVariation(filters?.range)}
              yDomain={[0, 100]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <SingleLineChart
              title='Test Coverage'
              data={overviewData || []}
              valueKey='static_test_coverage'
              status={overview.status}
              gitUrls={[filters?.gitUrl]}
              dateKey='create_time'
              yAxis={{
                label: {
                  title: 'Functions with tests (%)',
                  helpText: `
                    Test Coverage provides a metric to benchmark the percentage
                    of functions that are covered by at least one test-case.
                  `,
                  helpLink: '/help#test-coverage'
                }
              }}
              featured
              variant='sm'
              showVariation={shouldShowVariation(filters?.range)}
              yDomain={[0, 100]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <SingleLineChart
              title='Reusability'
              data={overviewData || []}
              valueKey='code_reusability'
              status={overview.status}
              gitUrls={[filters?.gitUrl]}
              dateKey='create_time'
              yAxis={{
                label: {
                  title: 'Reusability (%)',
                  helpText: `
                    Reusability is a measure of codebase redundancy.
                    Teams should strive for a high number indicating minimal
                    redundancy. A low score indicates significant levels of duplicated code.
                  `,
                  helpLink: '/help#reusability'
                }
              }}
              featured
              variant='sm'
              showVariation={shouldShowVariation(filters?.range)}
              yDomain={[0, 100]}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <SingleLineChart
              title='Modularity'
              data={overviewData || []}
              valueKey='modularity'
              status={overview.status}
              gitUrls={[filters?.gitUrl]}
              dateKey='create_time'
              yAxis={{
                label: {
                  title: 'Modularity (%)',
                  helpText: 'Modularity provides a measure of how independent and interchangeable components are.',
                  helpLink: '/help#modularity'
                }
              }}
              featured
              variant='sm'
              showVariation={shouldShowVariation(filters?.range)}
              yDomain={[0, 100]}
            />
          </CardContent>
        </Card>
      </StyledGraphGrid>
    </DetailsContent>
  )
}

export default function BoundedQuality () {
  return (
    <ErrorBoundary style={{ padding: '50px' }}>
      <Quality />
    </ErrorBoundary>
  )
}
