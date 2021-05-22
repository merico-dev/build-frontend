/* eslint-disable max-len */
/** @jsx jsx */
import { jsx, css } from '@emotion/core'
import { Suspense } from 'react'
import { useSelector } from 'react-redux'
import styled from '@emotion/styled'
import {
  Container,
  Typography,
  Link as MuiLink
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Armando_Fox from '@/images/Armando_Fox.jpeg'
import Camille from '@/images/Camille+Teruel.jpeg'
import Hezheng from '@/images/Hezheng.jpeg'
import Jinglei from '@/images/Jinglei.jpeg'
import Lucas from '@/images/Lucas.jpeg'
import Julio_Avalos from '@/images/Julio_Avalos.jpeg'
import Maxim from '@/images/Maxim.png'
import Roland from '@/images/Roland.png'

import Panel from '@/layouts/Panel'
import PageLoading from '@/components/PageLoading'
import BackToDashboardLink from '@/components/BackToDashboardLink'
import { dashboardLink } from '@/utils/dashboardLink'

// eslint-disable-next-line react/jsx-props-no-spreading
const TeamTypography = styled(({ featured, centered, ...props }) => (<Typography {...props} />))`
  &.MuiTypography-body1{
    line-height: 1.3;
    text-align: center;
    color: var(--color-gray-400);
    text-align: left;
    margin-bottom: 28px;
    ${({ centered }) => (centered ? 'text-align:center;' : '')}
    ${({ featured }) => {
    return featured
    ? `
      font-size: var(--text-xl);
      text-align:center;
      font-weight: 600;
      margin: 50px 0;
      color: var(--color-gray-500);
    `
    : 'font-size: 1.375rem;'
  }}
        &:first-of-type {
          margin-top: 0;
        }
  }
  &.MuiTypography-body2{
    font-size: 1rem;
    line-height: 1.5;
  }
  &.MuiTypography-h2,
  &.MuiTypography-h3 {
    color: var(--color-gray-400);
  }
  &.MuiTypography-h2 {
    margin: 50px 0;
  }
  &.MuiTypography-h3 {
    margin: 18px 0;
    font-size: var(--text-xl);
  }
`

const TeamsGrid = styled.div`
  justify-content: center;
  display: grid;
  gap: 50px 100px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 320px));

  ${({ doubleGrid }) => (doubleGrid
    ? `
      max-width: 740px;
      margin: 0 auto 80px;
    `
    : '')}

  & > div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  img {
    max-height: 300px;
    max-width: 300px;
    width: 100%;
  }
`

export default function Team () {
  const isAuthenticated = useSelector((state) => state.user.status === 'SUCCEED')
  return (
    <Panel sidebar={false}>
      <Helmet>
        <title>Team - Merico Build</title>
      </Helmet>
      <Suspense fallback={<PageLoading />}>
        {isAuthenticated && <BackToDashboardLink to={dashboardLink()}>Back to Dashboard</BackToDashboardLink>}
        <Container css={css`
          padding: 70px 0 40px;
        `}
        >
          <TeamTypography
            variant='body1'
            featured
          >
            Merico Build is brought to you by <MuiLink href='https://meri.co'>Merico</MuiLink>, the creators of Merico Enterprise Edition.
          </TeamTypography>
          <TeamTypography
            variant='body1'
            centered
          >
            Merico was founded by a  team of software and informatics experts to address a challenging problem:
          </TeamTypography>
          <TeamTypography
            variant='body1'
            featured
          >
            “HOW DO YOU MEASURE THE VALUE AND IMPACT OF CODE, AND THE DEVELOPERS THAT WRITE IT?”
          </TeamTypography>
          <TeamTypography
            variant='body1'
          >
            After years of research, our founders published the award-winning and widely cited ‘DevRank’ paper, Merico was born out of this research, translating theory into a practice with an innovative tool for the technology companies building the world of tomorrow.
          </TeamTypography>

          <TeamTypography
            variant='h2'
          >Leadership
          </TeamTypography>

          <TeamsGrid>
            <div>
              <img src={Jinglei} alt='Placeholder' />
              <TeamTypography variant='h3'>Jinglei Ren, Co-Founder & CEO</TeamTypography>
              <TeamTypography variant='body2'>Jinglei was most recently a researcher at Microsoft Research, designing advanced software and hardware systems. He founded The Persper Foundation in 2018, an initiative to bring &quot;intellectual shareholding&quot; to open source projects. He obtained his Ph.D. from Tsinghua University and was a Visiting Researcher/Scholar at Stanford University and CMU.</TeamTypography>
            </div>
            <div>
              <img src={Hezheng} alt='Placeholder' />
              <TeamTypography variant='h3'>Hezheng Yin, Co-Founder & CTO</TeamTypography>
              <TeamTypography variant='body2'>Hezheng was most recently pursuing his Ph.D. in software engineering and applied machine learning at UC Berkeley. His research on quantifying the value of code contributions forms the foundation of Merico&apos;s advanced code analytics technologies.</TeamTypography>
            </div>
            <div>
              <img src={Roland} alt='Placeholder' />
              <TeamTypography variant='h3'>Roland Vogl, Co-Founder & Board Member</TeamTypography>
              <TeamTypography variant='body2'>Roland Vogl is a scholar, lawyer and entrepreneur with decades of expertise in legal informatics, intellectual property law, and innovation. Currently, he is Executive Director of the Stanford Program in Law, Science and Technology and a Lecturer in Law at Stanford Law School.</TeamTypography>
            </div>
            <div>
              <img src={Lucas} alt='Placeholder' />
              <TeamTypography variant='h3'>Lucas Gonze, Head of Product</TeamTypography>
            </div>
            <div>
              <img src={Maxim} alt='Placeholder' />
              <TeamTypography variant='h3'>Maxim Wheatley, Head of Partnerships</TeamTypography>
            </div>
            <div>
              <img src={Camille} alt='Placeholder' />
              <TeamTypography variant='h3'>Camille Teruel, Senior Engineer</TeamTypography>
            </div>
          </TeamsGrid>

          <TeamTypography
            variant='h2'
          >Our Advisors
          </TeamTypography>
          <TeamsGrid
            doubleGrid
          >
            <div>
              <img src={Julio_Avalos} alt='Placeholder' />
              <TeamTypography variant='h3'>
                Mr. Julio Avalos, Former Chief Business Officer of GitHub, Board Member
              </TeamTypography>
            </div>
            <div>
              <img src={Armando_Fox} alt='Placeholder' />
              <TeamTypography variant='h3'>
                Dr. Armando Fox, UC Berkeley CS Professor
              </TeamTypography>
            </div>
          </TeamsGrid>
          <TeamTypography
            variant='body1'
          >
            <strong>Merico comes from the minds of software analysis & AI/ML experts from Microsoft Research, UC Berkeley, and Stanford.</strong>
          </TeamTypography>
          <TeamTypography
            variant='body1'
          >Every day, our team are working to develop powerful AI & big data solutions to extract insights from code, the core asset of software companies. Our team have spent years developing techniques to reliably measure and interpret code, taking our research developed in UC Berkeley’s Computer Science department and bringing it to our partners and clients.
          </TeamTypography>
          <TeamTypography
            variant='body1'
          >Our solutions are unique, in that they are the only analytics capable of objectively measuring the value and impact of contributions that developers make to software.
          </TeamTypography>
          <TeamTypography
            variant='body1'
          >Merico’s unique metrics and measurements bring fresh insights to enterprise engineering, HR teams, and open source projects. Our team spans the U.S., Asia, and Europe, bringing our international perspectives and findings to our product every day.
          </TeamTypography>
          <TeamTypography
            variant='body1'
          >Merico Build is brought to you by Merico, the creators of Merico Enterprise Edition, and by Persper Foundation.
            We are building a smart funding platform for open source projects.
          </TeamTypography>
          <TeamTypography
            variant='body1'
          >Our platform will enable compensation to be distributed to all contributors proportional to their contributions. That is a better way to help developers financially support themselves, thereby making the community thrive and enabling developers to freely work on what they love. For the long-term vision, please see our talk at MIT/Harvard: Beyond the Dichotomy of Open-Source and Corporate Worlds.
          </TeamTypography>
          <TeamTypography
            variant='body1'
          >Drop us a message <Link to='/contact' style={{ color: 'var(--color-primary-400)', textDecoration: 'none' }}>here</Link>.
          </TeamTypography>
        </Container>
      </Suspense>
    </Panel>
  )
}
