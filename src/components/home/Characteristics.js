import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { mdMedia } from '@/styles/snippets/responsive'

const StyledCharacteristicsWrapper = styled.div`
  background: var(--color-background-600);
  padding: 60px 20px;
`

const StyledCharacteristics = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;

  ${mdMedia(css`
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  `)}
`

const StyledCharacteristic = styled.div`
  border-radius: 20px;
  box-shadow: var(--elevation-1);
  overflow: hidden;
  max-width: 400px;
  margin: 0 auto;

  ${mdMedia(css`
    max-width: 100%;
  `)}
`

const StyledCharacteristicTitle = styled.h3`
  height: 70px;
  background: var(--color-gray-400);
  color: #fff;
  font-size: var(--text-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  text-align: center;
`

const StyledCharacteristicText = styled.div`
  color: var(--color-gray-500);
  padding: 15px;
  line-height: 1.3;
`

export default function Characteristics () {
  return (
    <StyledCharacteristicsWrapper>
      <StyledCharacteristics>
        <StyledCharacteristic>
          <StyledCharacteristicTitle>Avoid popularity contests</StyledCharacteristicTitle>
          <StyledCharacteristicText>
            Our metrics are objective and quantitative,
            taking social complications out of the picture.
          </StyledCharacteristicText>
        </StyledCharacteristic>
        <StyledCharacteristic>
          <StyledCharacteristicTitle>Know when you&apos;re progressing</StyledCharacteristicTitle>
          <StyledCharacteristicText>
            We visualize your performance over time.
            You can see how your work now compares to before,
            and see how you&apos;re doing compared to other contributors.
          </StyledCharacteristicText>
        </StyledCharacteristic>
        <StyledCharacteristic>
          <StyledCharacteristicTitle>Save time writing status updates</StyledCharacteristicTitle>
          <StyledCharacteristicText>
            We automatically document what you&apos;ve been doing,
            providing hard data so that you don&apos;t have to make a list manually.
          </StyledCharacteristicText>
        </StyledCharacteristic>
      </StyledCharacteristics>
    </StyledCharacteristicsWrapper>
  )
}
