import React from 'react'

import Papers from '@/images/paper.png'
import EELogin from '@/images/previous-ee.png'

import { StyledSubtitle, StyledTitle } from '@/components/home/Heading'
import {
  ShowAndTellWrapper,
  ShowAndTellContent,
  ShowAndTellText,
  ShowAndTellItem
} from '@/components/home/ShowAndTell'

export default function WhyUs () {
  return (
    <ShowAndTellWrapper dark>
      <ShowAndTellContent>
        <StyledTitle bottom={49}>Why Us?</StyledTitle>
        <ShowAndTellItem>
          <img src={Papers} alt='Scientific papers' />
          <div>
            <StyledSubtitle bottom={20}>Based in Research</StyledSubtitle>
            <ShowAndTellText>
              After years of research, our founders published the award-winning
              and widely cited ‘DevRank’ paper.
              Merico was born out of this research,
              translating theory into a practice with an innovative tool for the
              technology companies building the world of tomorrow.
            </ShowAndTellText>
          </div>
        </ShowAndTellItem>
        <ShowAndTellItem>
          <div>
            <StyledSubtitle bottom={20}>Previous Success</StyledSubtitle>
            <ShowAndTellText>
              Our company already does developer performance metrics for engineering managers.
              Merico makes it easy to understand the metrics that matter most to them.
              How effective are your teams? How good is your code base?<br /><br />
              Now we are making this intelligence available to developers for their own use.
            </ShowAndTellText>
          </div>
          <img src={EELogin} alt='A laptop with application Merico open' />
        </ShowAndTellItem>
      </ShowAndTellContent>
    </ShowAndTellWrapper>
  )
}
