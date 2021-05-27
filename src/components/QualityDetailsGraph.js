import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import PageLoading from '@/components/PageLoading'

import {
  IconButton
} from '@material-ui/core'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

import HelpPopover from '@/components/HelpPopover'
import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import EmptyMessage from '@/components/Empty/EmptyMessage'
import { emptyMessageTypes } from '@/enums/emptyMessageTypes'

const StyledDetailsGraph = styled.div`
  position: relative;
  box-sizing: border-box;
  padding: 0;
`

const StyledNoData = styled.div`
  max-width: 240px;
  margin: 18px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledLoader = styled.div`
  width: 40px;
  height: 40px;
  display: block;
  margin: 18px auto;
`

const StyledHelpIcons = styled.div`
  margin-top: -12px;
  margin-left: 30px;
  max-width: ${props => props.width}px;
  display: flex;
  justify-content: space-around;
  text-align: center;
`

export default function QualityDetailsGraph (props) {
  const {
    width = 464,
    minWidth = 464,
    height = 300,
    defaultBarSize = 20,
    layout = 'horizontal',
    data = [],
    redraw = false,
    isFetching = false,
    showEmptyGraph = true
  } = props

  const [barSize, setBarSize] = useState(defaultBarSize)
  const [emptyData, setEmptyData] = useState(true)
  // const GridRef = useRef(null)

  const createHelpIcon = (label, link = '/help') => {
    return (
      <HelpPopover
        content={`
          ${label}
        `}
        moreLink={link}
      >
        <IconButton size='small' aria-label='More information'>
          <QuestionCircle width='17.5' height='17.5' />
        </IconButton>
      </HelpPopover>
    )
  }

  const getBarLabel = (props) => {
    const { x, y, value, width } = props
    return (
      <text
        x={x}
        y={y - 20}
        dy={value >= 90 ? 40 : 12}
        dx={value >= 90 ? width + 5 : width - width - 4}
        fontSize='12'
        fontFamily='sans-serif'
        fill='#717484'
        textAnchor='right'
      >
        {value}%
      </text>
    )
  }

  useEffect(() => {
    setBarSize(defaultBarSize)
    if (data.length === 0 || !data.some((point) => point.value > 0)) {
      setEmptyData(true)
    } else {
      setEmptyData(false)
    }
  }, [data, defaultBarSize])

  useEffect(() => {
    // Re-draw component for proper graph scaling
  }, [redraw])

  if (isFetching) {
    return <StyledLoader><PageLoading size={40} /></StyledLoader>
  }

  if (!showEmptyGraph && ((!isFetching && data.length === 0) || data.some((bar) => bar.value === undefined))) {
    return (<StyledNoData><EmptyMessage type={emptyMessageTypes.noData} title='No data' /></StyledNoData>)
  }

  return (
    <StyledDetailsGraph>
      <div
        style={{
          // border: '2px solid red',
          width: `${Math.max(minWidth, width) - 30}px`,
          height: height - 50,
          maxWidth: `${Math.max(minWidth, width)}px`,
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          justfiyContent: 'space-evenly',
          top: 15,
          left: 30,
          opacity: emptyData ? 0.3 : 1
        }}
      >
        <div
          data-excellent
          style={{
            display: 'flex',
            height: '25%',
            fontSize: '12px',
            color: '#89E6B9',
            backgroundColor: 'rgba(137, 230, 185, 0.1)',
            textAlign: 'right',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: '10px',
            fontWeight: 'bold',
            borderTop: '1px solid #DEDFE3'
          }}
        >
          Excellent
        </div>
        <div
          data-good
          style={{
            display: 'flex',
            height: '25%',
            fontSize: '12px',
            color: '#83E1FF',
            backgroundColor: 'rgba(131, 225, 255, 0.1)',
            textAlign: 'right',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: '10px',
            fontWeight: 'bold',
            borderTop: '1px solid #DEDFE3'
          }}
        >
          Good
        </div>
        <div
          data-fair
          style={{
            display: 'flex',
            height: '25%',
            fontSize: '12px',
            color: '#9FA8F9',
            backgroundColor: 'rgba(159, 168, 249, 0.1)',
            textAlign: 'right',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: '10px',
            fontWeight: 'bold',
            borderTop: '1px solid #DEDFE3'
          }}
        >
          Fair
        </div>
        <div
          data-poor
          style={{
            display: 'flex',
            height: '25%',
            fontSize: '12px',
            color: '#F99FEB',
            backgroundColor: 'rgba(249, 159, 235, 0.1)',
            textAlign: 'right',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingRight: '10px',
            fontWeight: 'bold',
            borderTop: '1px solid #DEDFE3'
          }}
        >
          Poor
        </div>
      </div>
      {showEmptyGraph && emptyData && (
        <StyledNoData style={{ position: 'absolute', top: '20%', left: 'calc(50% - 240px/2)' }}>
          <EmptyMessage type={emptyMessageTypes.noData} title='No data' />
        </StyledNoData>
      )}
      <BarChart
        width={Math.max(minWidth, width)}
        height={height}
        layout={layout}
        data={data}
        margin={{
          top: 15,
          right: 0,
          left: -30,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' stroke='none' />
        <XAxis
          dataKey='name'
          fontSize={14}
          tick={{ fill: '#717484' }}
          tickFormatter={(label) => label}
          stroke='#DEDFE3'
        />
        <YAxis
          ticks={[0, 25, 50, 75, 100]}
          tick={{ fill: '#717484' }}
          fontSize={14}
          stroke='none'
        />
        <Tooltip cursor={{ fill: 'rgba(200,200,200,0.2)' }} />
        <Bar
          dataKey='value'
          layout={layout}
          barSize={barSize}
          label={getBarLabel}
          fill='#F0876A'
        />
      </BarChart>
      <StyledHelpIcons width={width}>
        <div style={{ flexGrow: 1 }}>{createHelpIcon('Doc Coverage', '/help#doc-coverage')}</div>
        <div style={{ flexGrow: 1 }}>{createHelpIcon('Test Coverage', '/help#test-coverage')}</div>
        <div style={{ flexGrow: 1 }}>{createHelpIcon('Code Reusability', '/help#reusability')}</div>
        <div style={{ flexGrow: 1 }}>{createHelpIcon('Modularity', '/help#modularity')}</div>
      </StyledHelpIcons>
    </StyledDetailsGraph>
  )
}
