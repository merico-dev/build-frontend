import React from 'react'
import styled from '@emotion/styled'

import { ReactComponent as MaintainersELOC } from '@/components/home-beta/images/maintainers-1.svg'
import { ReactComponent as MaintainersTopLanguages } from '@/components/home-beta/images/maintainers-2.svg'
import { ReactComponent as MaintainersTotalELOC } from '@/components/home-beta/images/maintainers-3.svg'

import { ReactComponent as ContributorsKnow } from '@/components/home-beta/images/contributors-1.svg'
import { ReactComponent as ContributorsProof } from '@/components/home-beta/images/contributors-2.svg'
import { ReactComponent as ContributorsShowOff } from '@/components/home-beta/images/contributors-3.svg'

import { ReactComponent as NurtureIcon } from '@/icons/nurture.svg'
import { ReactComponent as CommunicateIcon } from '@/icons/communicate.svg'
import { ReactComponent as RewardIcon } from '@/icons/reward.svg'

// const aboutImageOne = 'https://cdn.mericobuild.com/home/images/about-1.png'
// const aboutImageTwo = 'https://cdn.mericobuild.com/home/images/about-2.png'
// const aboutImageThree = 'https://cdn.mericobuild.com/home/images/about-3.png'
const researchImage = 'https://cdn.mericobuild.com/home/images/research.png'
const successImage = 'https://cdn.mericobuild.com/home/images/success.png'
// const analyticsImage = 'https://cdn.mericobuild.com/home/images/analytics.png'
// const improvementImage = 'https://cdn.mericobuild.com/home/images/improvement.png'

const StyledLanding = styled.div`
  .use-cases-icon {
    width: 136px;
    height: 136px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    color: var(--color-gray-400);
    font-size: 70px;
  }

  p, ul {
    color: var(--color-gray-500);
    font-family: 'Source Sans Pro', 'Space Grotesk', sans-serif;
  }
`

const StyledUseCases = styled.div`
  color: inherit;
`

// const StyledCaseIcon = styled.img`
//   min-width: 16px;
//   min-height: 16px;
//   width: 70px;
//   height: 70px;
//   max-width: 70px;
//   max-height: 70px;
// `

/* eslint max-len: ["error", { "code": 300 }] */
export default function Landing () {
  return (
    <StyledLanding>
      <div className='container py-5 mt-5'>
        <div className='row justify-content-center'>
          <div className='col-sm-12 align-items-center'>
            <div className='display-4 text-primary font-weight-bold mb-4 text-center'>FOR MAINTAINERS</div>
          </div>
          <div className='row mt-4 mb-4'>
            <div className='col-sm-12 col-md-4 text-center'>
              <MaintainersELOC width='320' height='240' style={{ maxWidth: '100%' }} />
              <div className='display-4 text-primary text-center font-weight-bold mt-4 mb-4'>Engineering Intelligence</div>
              <ul className='text-left'>
                <li>Use objective metrics instead of gut instincts to understand patterns in source code, Git history and pull requests.</li>
                <li>Save time and get a more accurate picture by using automation.</li>
                <li>Get insights across time, across repositories, and even by contributor organization.</li>
              </ul>
            </div>
            <div className='col-sm-12 col-md-4 text-center'>
              <MaintainersTopLanguages width='320' height='240' style={{ maxWidth: '100%' }} />
              <div className='display-4 text-primary text-center font-weight-bold mt-4 mb-4'>Community Management</div>
              <ul className='text-left'>
                <li>See who is active and whose contributions are growing.</li>
                <li>Measure community growth in the short and long term.</li>
                <li>Unlike GitHub Insights, compare any subset of people or repositories across any time period.</li>
              </ul>
            </div>
            <div className='col-sm-12 col-md-4 text-center'>
              <MaintainersTotalELOC width='320' height='240' style={{ maxWidth: '100%' }} />
              <div className='display-4 text-primary text-center font-weight-bold mt-4 mb-4'>OSS Culture</div>
              <ul className='text-left'>
                <li>Business-oriented tools like GitPrime are irrelevant and a little abrasive in open source.</li>
                <li>Our approach fits open, transparent, decentralized teams of highly independent contributors.</li>
              </ul>
            </div>
          </div>
          {/* <div className='row row-cols-1 row-cols-sm-2 mb-4 '>
            <div className='col mb-4 mb-sm-0'>
              <img src={aboutImageOne} className='img-fluid' alt='' />
            </div>
            <div className='col'>
              <div className='display-4 text-primary font-weight-bold mb-3'>Let your contributions shine</div>
              <p>
                Discover and articulate your strengths and contribution value,
                all with data directly from your commits, all for free,
                powered by cutting-edge contribution analytics.
              </p>
            </div>
          </div> */}

          {/* <div className='row row-cols-1 row-cols-sm-2 mb-4 align-items-center'>
            <div className='col order-2 order-sm-1'>
              <div className='display-4 text-primary font-weight-bold mb-3'>Practical insights from code</div>
              <p>
                Understand your impact, productivity, and code-quality
                with transparent metrics that translate into actionable
                insight and results.
              </p>
            </div>
            <div className='col mb-4 mb-sm-0 order-1 order-sm-2'>
              <img src={aboutImageTwo} className='img-fluid' alt='' />
            </div>
          </div> */}

          {/* <div className='row row-cols-1 row-cols-sm-2 align-items-center'>
            <div className='col mb-4 mb-sm-0'>
              <img src={aboutImageThree} className='img-fluid' alt='' />
            </div>
            <div className='col'>
              <div className='display-4 text-primary font-weight-bold mb-3'>Translate your contributions into recognition</div>
              <p>
                Don&apos;t let your OSS contributions go uncelebrated,
                translate your work into objective and shareable
                proof-of-accomplishment.
              </p>
            </div>
          </div> */}
        </div>
      </div>

      <hr />

      <div className='container py-5 mt-4'>
        <div className='row justify-content-center'>
          <div className='col-sm-12 align-items-center'>
            <div className='display-4 text-primary font-weight-bold mb-4 text-center'>FOR CONTRIBUTORS</div>
          </div>
        </div>
        <div className='row mt-4 mb-4'>
          <div className='col-sm-12 col-md-4 text-center'>
            <ContributorsKnow width='320' height='240' style={{ maxWidth: '100%' }} />
            <div className='display-4 text-primary text-center font-weight-bold mt-4 mb-4'>Know Where You Stand</div>
            <ul className='text-left'>
              <li>
                Use our leaderboard to check that you're doing your part and see how your partners are doing. Our developer leaderboard allows engineers to see their ranking by ELOC, impact, and PRs.
              </li>
            </ul>
          </div>
          <div className='col-sm-12 col-md-4 text-center'>
            <ContributorsProof width='320' height='240' style={{ maxWidth: '100%' }} />
            <div className='display-4 text-primary text-center font-weight-bold mt-4 mb-4'>Get Proof of Skills</div>
            <ul className='text-left'>
              <li>
                Earn and share badges for mastering languages, reducing code complexity, and other technical achievements.
              </li>
            </ul>
          </div>
          <div className='col-sm-12 col-md-4 text-center'>
            <ContributorsShowOff width='320' height='240' style={{ maxWidth: '100%' }} />
            <div className='display-4 text-primary text-center font-weight-bold mt-4 mb-4'>Show Off Your Contributions</div>
            <ul className='text-left'>
              <li>
                Embed proof of your work into social media, whether you were an early contributor or just got a commit accepted to something ridiculously picky. Show off GitHub work in LinkedIn or GitLab work in Gatsby.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* <div className='container py-5'>
        <div className='row justify-content-center'>
          <div className='col-lg-11 col-xl-10'>
            <div className='row row-cols-1 row-cols-md-3'>
              <div className='col mb-4 d-flex'>
                <div className='bg-white shadow w-100 py-4 px-4'>
                  <div className='font-16 text-primary font-weight-bold mb-3'>Let your code speak for itself.</div>
                  <p>Merico&apos;s metrics let your contribution shine with objective and quantitative measures.</p>
                </div>
              </div>
              <div className='col mb-4 d-flex'>
                <div className='bg-white shadow w-100 py-4 px-4'>
                  <div className='font-16 text-primary font-weight-bold mb-3'>Capture your progress and development.</div>
                  <p>Translate insight into career progression, improved contribution, and greater impact. Benchmark yourself against your peers and heroes.</p>
                </div>
              </div>
              <div className='col mb-4 d-flex'>
                <div className='bg-white shadow w-100 py-4 px-4'>
                  <div className='font-16 text-primary font-weight-bold mb-3'>Highlight your achievements automatically.</div>
                  <p>With Merico&apos;s metrics you never have to translate your work to articulate your value, Merico does it for you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className='py-5' style={{ backgroundColor: '#F4F4F6' }}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-11 col-xl-10 text-secondary'>
              <h4 className='text-center mb-5 text-uppercase txt-blinking'>
                <div className='wrap'>Use Cases</div>
              </h4>
              <StyledUseCases className='row row-cols-1 row-cols-sm-3'>
                <div className='col text-center px-lg-5'>
                  <div className='use-cases-icon mx-auto'><NurtureIcon width='70px' height='70px' /></div>
                  <div className='my-4'>
                    <p className='font-weight-bold font-16'>Nurture Community</p>
                    <p>
                      Who are your rising stars? Are the developers you worked hardest to onboard making the biggest contributions? ​What are contributors paying attention to? Whose work is the most impactful?
                    </p>
                  </div>
                </div>
                <div className='col text-center px-lg-5'>
                  <div className='use-cases-icon mx-auto'><CommunicateIcon width='70px' height='70px' /></div>
                  <div className='my-4'>
                    <p className='font-weight-bold font-16'>Communicate Maintainer Success</p>
                    <p>
                      Is your work to recruit and motivate developers paying off? Use our data visualizations on community growth and increasing productivity to tell your story to funders.
                    </p>
                  </div>
                </div>
                <div className='col text-center px-lg-5'>
                  <div className='use-cases-icon mx-auto'><RewardIcon width='70px' height='70px' /></div>
                  <div className='my-4'>
                    <p className='font-weight-bold font-16'>Reward Developers</p>
                    <p>Give developers incentives by enabling them to show off their skills, to demonstrate their contributions in social media, and to grow their impact.</p>
                  </div>
                </div>
              </StyledUseCases>
            </div>
          </div>
        </div>
      </div>

      <div className='py-5'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-9 col-xl-8'>
              <h4 className='text-center mb-5 text-uppercase text-primary txt-blinking'>
                <div className='wrap'>Why us</div>
              </h4>
              <div className='row row-cols-1 row-cols-sm-2'>
                <div className='col text-center px-lg-5'>
                  <img src={researchImage} className='img-fluid' alt='' />
                  <div className='my-4'>
                    <div className='display-4 font-18 text-primary text-center font-weight-bold mt-4 mb-4'>Research</div>
                    <p>
                      Our co-founders Jinglei Ren and Hezheng Yin wrote the &nbsp;
                      <a href='https://per.pub/A1Pd7xaM.pdf' target='_blank' rel='noreferrer'>DevRank</a> paper and founded the &nbsp;
                      <a href='https://www.persper.org/' target='_blank' rel='noreferrer'>Persper Foundation</a> before starting our company. &nbsp;
                      Our goal is to provide the most advanced and trusted contribution analysis technology.
                    </p>
                  </div>
                </div>
                <div className='col text-center px-lg-5'>
                  <img src={successImage} className='img-fluid' alt='' />
                  <div className='my-4'>
                    <div className='display-4 font-18 text-primary text-center font-weight-bold mt-4 mb-4'>Open Core</div>
                    <p>
                      We have lots of experience with the underlying technology as a result of building our product for the enterprise, &nbsp;
                      <a href='https://meri.co/' target='_blank' rel='noreferrer'>Merico Enterprise Edition</a>. &nbsp;
                      Merico Build is the open core of our commercial product for businesses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='py-5'>
        &nbsp;
      </div>
    </StyledLanding>
  )
}
