import React from 'react'

export default function CustomBarChartRating (props) {
  const {
    height,
    emptyData
  } = props

  return (
    <>
      <div
        style={{
          width: 'calc(100% - 30px)',
          height: height - 50,
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
    </>
  )
}
