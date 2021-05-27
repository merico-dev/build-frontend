/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import styled from '@emotion/styled'

import WalkingOnMetrics from '@/images/walking-on-metrics.png'
import HoldMetrics from '@/images/hold-metrics.png'
import CodeScale from '@/images/code-scale.png'
import { smMedia } from '@/styles/snippets/responsive'

const StyledAdvantages = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 30px 20px 24px;
  ${smMedia(css`
    padding: 105px 20px 80px;
  `)}
`

const StyledAdvantagesTitle = styled.h3`
  font-size: var(--text-xl);
  font-weight: var(--text-semibold);
  color: var(--color-primary-400);
  margin: 0 0 16px;
  ${smMedia(css`
    font-size: var(--text-xxxl);
    margin: 0 0 20px;
  `)}
`

const StyledAdvantageItem = styled.div`
  font-size: var(--text-xs);
  color: var(--color-gray-500);
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 24px;
  ${smMedia(css`
    font-size: var(--text-xl);
    grid-template-columns: 1fr 1fr;
    gap: 70px;
  `)}
`

const StyledAdvantagesImage = styled.img`
  margin: 0 auto;
  grid-row-start: 2;
  max-width: 100%;
  ${smMedia(css`
    grid-row-start: auto;
  `)}
`

export default function Advantages () {
  return (
    <StyledAdvantages>
      <StyledAdvantageItem>
        <div>
          <StyledAdvantagesTitle>
            Measure your productivity
          </StyledAdvantagesTitle>
          Know when you&apos;re ahead and when you&apos;re behind,
          and pick up the pace without having to be told.
        </div>
        <StyledAdvantagesImage
          src={WalkingOnMetrics}
          alt='A person walking on a line chart with code in the background'
        />
      </StyledAdvantageItem>

      <StyledAdvantageItem css={css`margin-top: 25px;`}>
        <StyledAdvantagesImage
          src={HoldMetrics}
          alt='A person holding small screens with metrics'
        />
        <div>
          <StyledAdvantagesTitle>
            See where you need to improve
          </StyledAdvantagesTitle>
          Track your impact, productivity and quality,
          and get detailed breakdowns of factors influencing them.
        </div>
      </StyledAdvantageItem>

      <StyledAdvantageItem css={css`margin-top: 70px;`}>
        <div>
          <StyledAdvantagesTitle>
            Have a bigger impact
          </StyledAdvantagesTitle>
          Know which work mattered the most.
          Focus your efforts on critical components.
        </div>
        <StyledAdvantagesImage
          src={CodeScale}
          alt='Two code pieces being measured together while someone sits on the scale'
        />
      </StyledAdvantageItem>
    </StyledAdvantages>
  )
}
