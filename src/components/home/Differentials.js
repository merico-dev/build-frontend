import React from 'react'

import ChartsPreview from '@/images/charts-preview.png'
import Ranking from '@/images/ranking-preview.png'

import { StyledSubtitle, StyledTitle } from '@/components/home/Heading'
import {
  ShowAndTellWrapper,
  ShowAndTellContent,
  ShowAndTellText,
  ShowAndTellItem
} from '@/components/home/ShowAndTell'

export default function WhyUs () {
  return (
    <ShowAndTellWrapper>
      <ShowAndTellContent>
        <StyledTitle bottom={49}>How Are We Different?</StyledTitle>
        <ShowAndTellItem>
          <img
            src={ChartsPreview}
            alt='A heatbar, a radial bar chart and a lina chart with Productivity as title'
          />
          <div>
            <StyledSubtitle bottom={20}>Analytics for code, not workflows</StyledSubtitle>
            <ShowAndTellText>
              If you have code, you can use Merico -- our insights flow from the codebase itself.
              We provide true deep-analysis on source code,
              leveraging program analysis and machine learning,
              rather than the surface-layer statistics of lines of code, issues,
              commit count that other solutions provide.
              Merico provides valuable and actionable insights regardless of what&apos;s in Jira.
            </ShowAndTellText>
          </div>
        </ShowAndTellItem>
        <ShowAndTellItem>
          <div>
            <StyledSubtitle bottom={20}>Self Improvement</StyledSubtitle>
            <ShowAndTellText>
              This software is for your life as a hacker.
              It&apos;s about how well you do debugging,
              but it&apos;s not a debugger.
              It&apos;s about how productive you are,
              but it&apos;s not a tool for producing. It&apos;s about you, not the code.
            </ShowAndTellText>
          </div>
          <img
            src={Ranking}
            alt='A line chart with Productivity as title'
          />
        </ShowAndTellItem>
      </ShowAndTellContent>
    </ShowAndTellWrapper>
  )
}
