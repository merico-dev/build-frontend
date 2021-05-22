import React from 'react'
import styled from '@emotion/styled'

import Ranking from '@/images/ranking.png'
import SearchCode from '@/images/search-code.png'
import MetricWindow from '@/images/metric-window.png'
import { StyledTitle, StyledSubtitle } from '@/components/home/Heading'
import { mdMedia } from '@/styles/snippets/responsive'
import { css } from '@emotion/core'

const StyledUseCasesWrapper = styled.div`
  padding: 0 20px;
`

const StyledUseCases = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 30px 0;

  ${mdMedia(css`
    margin: 60px auto;
    box-shadow: var(--elevation-1);
    border-radius: 20px;
    padding: 40px;
  `)}
`

const StyledUseCasesList = styled.div`
  display: grid;
  gap: 35px;
  grid-template-columns: 1fr;

  ${mdMedia(css`
    grid-template-columns: repeat(3, 1fr);
  `)}
`

const StyledUseCasesItemImage = styled.div`
  height: 165px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  max-width: 138px;

  ${mdMedia(css`
    margin-bottom: 46px;
    max-width: 100%;
  `)}

  img {
    max-width: 100%;
  }
`

export default function UseCases () {
  return (
    <StyledUseCasesWrapper>
      <StyledUseCases>
        <StyledTitle bottom={74}>Use Cases</StyledTitle>
        <StyledUseCasesList>
          <div>
            <StyledUseCasesItemImage>
              <img src={Ranking} alt='Lollipop ranking chart' />
            </StyledUseCasesItemImage>
            <StyledSubtitle height={52} bottom={28} align='center'>
              Learn how your work compares to others&apos; in your team
            </StyledSubtitle>
            See your performance ranked on six different facets,
            contextualized with progress over time
          </div>
          <div>
            <StyledUseCasesItemImage>
              <img src={SearchCode} alt='Code search with a magnifier' />
            </StyledUseCasesItemImage>
            <StyledSubtitle height={52} bottom={28} align='center'>
              Track bad code back to commits
            </StyledSubtitle>
            Have your code automatically checked for quality,
            security and technical debt. When a spike occurs,
            see which commits are responsible.
          </div>
          <div>
            <StyledUseCasesItemImage>
              <img src={MetricWindow} alt='A window with charts' />
            </StyledUseCasesItemImage>
            <StyledSubtitle height={52} bottom={28} align='center'>
              Support your resource requests with data about the need
            </StyledSubtitle>
            When you ask for hires or computing resources your boss may
            think you just need to be a better technologist.
            Using our analytics you can show that your performance is not the problem.
          </div>
        </StyledUseCasesList>
      </StyledUseCases>
    </StyledUseCasesWrapper>
  )
}
