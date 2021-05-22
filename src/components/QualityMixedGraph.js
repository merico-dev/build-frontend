import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import PageLoading from '@/components/PageLoading'
import { Link } from 'react-router-dom'

import {
  Button
} from '@material-ui/core'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts'

import GaugeChart from 'react-gauge-chart'
import EmptyMessage from '@/components/Empty/EmptyMessage'
import { emptyMessageTypes } from '@/enums/emptyMessageTypes'
import { humanPercentage } from '@/utils/numbers'

const StyledBarGraph = styled.div`
  border: 0;
  margin-top: 20px;
`
const StyledGuage = styled.div`
  max-width: 520px;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
`

const StyledQualityScore = styled.div`
  color: #717484;
  text-align: center;
  margin-bottom: 20px;
`
const StyledNoData = styled.div`
  max-width: 240px;
  margin: 18px auto;
`

const StyledDetailsLink = styled(Link)`
  text-decoration: none;
  outline: none;
`

export default function QualityMixedGraph (props) {
  const {
    width = 600,
    minWidth = 320,
    height = 300,
    defaultBarSize = 15,
    data = [],
    dataKey = 'name',
    showDetailsButton = false,
    isFetching = false,
    redraw = false,
    guageOnly = false
  } = props

  const [barSize, setBarSize] = useState(defaultBarSize)
  const [isLoading, setIsLoading] = useState(true)
  const [qualityScore, setQualityScore] = useState(0)

  const barColors = [
    '#B2B4BD',
    '#F0876A',
    '#83E1FF',
    '#89E6B9',
    '#F99FEB',
    '#9FA8F9',
    '#F8D661',
  ]

  const getBarColor = (index) => {
    return index > barColors.length ? barColors[Math.floor(Math.random() * (barColors.length))] : barColors[index]
  }

  const getBarLabel = (props) => {
    const { x, y, value, width } = props
    return (
      <text
        x={x}
        y={y}
        dy={12}
        dx={width + 20}
        fontSize='12'
        fontFamily='sans-serif'
        fill='#717484'
        textAnchor='right'
      >
        {value}%
      </text>
    )
  }

  const calculateBarHeight = () => {
    return data.length > 1 ? data.length * 50 : 100
  }

  useEffect(() => {
    const score = data && !isNaN(data[0]?.quality / 100) ? data[0].quality / 100 : 0
    setQualityScore(score)
    setBarSize(defaultBarSize)
  }, [data, defaultBarSize])

  useEffect(() => {
    setIsLoading(isFetching)
  }, [isFetching])

  useEffect(() => {
    // Re-draw component for proper graph scaling
  }, [redraw])

  // const getOverallScore = () => {
  //   return isLoading ? <strong>{data[0]?.quality}</strong> : <PageLoading size={18} />
  // }

  if (isLoading) {
    return <div style={{ width: '40px', height: '40px', display: 'block', margin: '18px auto' }}><PageLoading size={40} /></div>
  }

  if (!isLoading && !guageOnly && data && data.length > 1) {
    return (
      <>
        <StyledBarGraph style={{ width: `${width}px`, position: 'relative' }}>
          <div
            style={{
              // borderLeft: '1px solid #DEDFE3',
              width: `${Math.max(minWidth, width) - 150}px`,
              height: Math.min(calculateBarHeight() - 45 + 24, height),
              maxWidth: `${Math.max(minWidth, width)}px`,
              position: 'absolute',
              display: 'flex',
              flexDirection: 'row',
              justfiyContent: 'space-evenly',
              alignItems: 'top',
              top: -24,
              left: 129,
            }}
          >
            <div
              data-poor
              style={{
                display: 'flex',
                width: '25%',
                fontSize: '12px',
                color: '#F99FEB',
                backgroundColor: 'rgba(249, 159, 235, 0.1)',
                textAlign: 'right',
                justifyContent: 'center',
                alignItems: 'top',
                paddingRight: '10px',
                fontWeight: 'bold',
                paddingTop: '4px',
                lineHeight: '20px',
                borderLeft: '1px solid #DEDFE3'
              }}
            >
              Poor
            </div>
            <div
              data-fair
              style={{
                display: 'flex',
                width: '25%',
                fontSize: '12px',
                color: '#9FA8F9',
                backgroundColor: 'rgba(159, 168, 249, 0.1)',
                textAlign: 'right',
                justifyContent: 'center',
                alignItems: 'top',
                paddingRight: '10px',
                fontWeight: 'bold',
                paddingTop: '4px',
                lineHeight: '20px',
                // borderTop: '1px solid #DEDFE3'
              }}
            >
              Fair
            </div>
            <div
              data-good
              style={{
                display: 'flex',
                width: '25%',
                fontSize: '12px',
                color: '#83E1FF',
                backgroundColor: 'rgba(131, 225, 255, 0.1)',
                textAlign: 'right',
                justifyContent: 'center',
                alignItems: 'top',
                paddingRight: '10px',
                fontWeight: 'bold',
                paddingTop: '4px',
                lineHeight: '20px',
                // borderTop: '1px solid #DEDFE3'
              }}
            >
              Good
            </div>
            <div
              data-excellent
              style={{
                display: 'flex',
                width: '25%',
                fontSize: '12px',
                color: '#89E6B9',
                backgroundColor: 'rgba(137, 230, 185, 0.1)',
                textAlign: 'right',
                justifyContent: 'center',
                alignItems: 'top',
                paddingRight: '10px',
                fontWeight: 'bold',
                paddingTop: '4px',
                lineHeight: '20px',
                // borderTop: '1px solid #DEDFE3'
              }}
            >
              Excellent
            </div>
          </div>
          <BarChart
            width={width}
            height={calculateBarHeight()}
            layout='vertical'
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 70,
              bottom: 15,
            }}
          >
            {/* <QualityChartBg style={{ position: 'relative', top: '0', left: '0' }} width='640' height='100%' /> */}
            <CartesianGrid strokeDasharray='3 3' stroke='none' fill='transparent' />
            <XAxis
              axisLine={{ stroke: '#DEDFE3' }}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(label) => `${label} %`}
              type='number'
              fontSize={12}
              tick={{ angle: 0, fill: '#717484' }}
              textAnchor='end'
              stroke='none'
            />
            <YAxis
              axisLine={{ stroke: 'none' }}
              dataKey={dataKey}
              tick={{ fontSize: '14', fill: '#717484' }}
              type='category'
              stroke='none'
              interval={0}
            />
            <Tooltip cursor={{ fill: 'rgba(200,200,200,0.2)' }} />
            <Bar
              dataKey='quality'
              fill={getBarColor(0)}
              layout='vertical'
              barSize={barSize}
              label={getBarLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`qualitybar-cell-${index}`}
                  stroke={4}
                  fill={getBarColor(index)}
                />
              ))}
            </Bar>
          </BarChart>
          <div style={{
            textAlign: 'right',
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#717484',
            paddingRight: '18px'
          }}
          >
            Overall Score
          </div>
        </StyledBarGraph>
      </>
    )
  }

  if (!isLoading && data && (data.length === 1 || guageOnly)) {
    return (
      <StyledGuage>
        <GaugeChart
          id='quality-guage-chart'
          nrOfLevels={30}
          colors={['#00c1ff', '#F4F4F6']}
          needleColor='#dddddd'
          needleBaseColor='#aaaaaa'
          arcWidth={0.15}
          percent={qualityScore}
          textColor='#717484'
          fontSize='16'
          textAnchor='left'
        />
        <StyledQualityScore>
          Overall Score <strong>{humanPercentage(qualityScore, 2)}%</strong>
        </StyledQualityScore>
        {showDetailsButton && (
          <StyledDetailsLink to={{ pathname: '/dashboard/quality' }}>
            <Button
              style={{ display: 'block', margin: '30px auto 10px auto' }}
              variant='contained'
              color='primary'
              disabled={isLoading}
            >
              View Details
            </Button>
          </StyledDetailsLink>
        )}
      </StyledGuage>
    )
  }

  if (!isLoading && (!data || data.length === 0)) {
    return (<StyledNoData><EmptyMessage type={emptyMessageTypes.noData} title='No data' /></StyledNoData>)
  }
}
