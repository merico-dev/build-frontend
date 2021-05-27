/* eslint-disable max-len */
import React from 'react'
import styled from '@emotion/styled'

import TermsTypography from '@/components/TermsTypography'
import { ReactComponent as Padlock } from '@/icons/padlock.svg'
import { ReactComponent as BadgeLinguistTypeIcon } from '@/icons/badge-types/linguist.svg'
import { ReactComponent as BadgeMultilingualTypeIcon } from '@/icons/badge-types/multilingual.svg'
import { ReactComponent as BadgeTrailblazerTypeIcon } from '@/icons/badge-types/trailblazer.svg'
import { ReactComponent as BadgeContributionTypeIcon } from '@/icons/badge-types/contribution.svg'
import { ReactComponent as BadgeTopContributorTypeIcon } from '@/icons/badge-types/top-contributor.svg'
import { ReactComponent as BadgeMinesweeperTypeIcon } from '@/icons/badge-types/minesweeper.svg'
import { ReactComponent as BadgeTestOfTimeTypeIcon } from '@/icons/badge-types/test-of-time.svg'

import { ReactComponent as BadgeExample } from '@/images/badge-examples/badge.svg'
import { ReactComponent as LinguistExampleBadgeGold } from '@/images/badge-examples/linguist-gold.svg'
import { ReactComponent as LinguistExampleBadgeSilver } from '@/images/badge-examples/linguist-silver.svg'
import { ReactComponent as LinguistExampleBadgeBronze } from '@/images/badge-examples/linguist-bronze.svg'
import { ReactComponent as LinguistExampleBadgeIron } from '@/images/badge-examples/linguist-iron.svg'
import { ReactComponent as LinguistExampleBadgeLocked } from '@/images/badge-examples/linguist-locked.svg'

const StyledQuote = styled.div`
  border-left: solid 2px var(--color-primary-400);
  padding: 5px 16px;
  color: var(--color-secondary-400);
`

const StyledCode = styled.div`
  font-size: 0.9em;
  background: #f3f3f3;
  padding: 8px;
  border: solid 1px var(--color-secondary-200);
  border-radius: 4px;
  display: inline-block;

  strong {
    display: inline-block;
    padding: 0 5px;
  }
`

const StyledMedalGradeIcon = styled.span`
    display: inline-block;
    width: 20px;
    height: 12px;
    background-color: #F9CE78;
    border-radius: 2px;
    float: left;
    margin-right: 7px;

    &.gold {
     background-color: #F9CE78;
    }

    &.silver {
      background-color: #DEDFE3;
    }

    &.bronze {
      background-color: #EDB494;
    }

    &.iron {
      background-color: #B2B4BD;
    }

    &.locked {
      background-color: #ffffff;
      border: 1px solid #DEDFE3;
      text-align: center;
      position: relative;

      svg {
        margin-top: -5px;
        position: absolute;
        left: 3px;
      }
    }
`

const StyledMedalGrades = styled.ul`
  margin: 18px 0;
  padding: 0;
  list-style: none;
  font-size: 13px;
  display: block;
  clear: both;
`

const StyledMedalGradeItem = styled.li`
  display: block;
  height: 28px;
  line-height: 100%;
  float: left;
  margin-right: 15px;
  margin-bottom: 15px;
  font-size: 13px;
  font-weight: bold;
  color: #4B4D58;

  span:first-of-type {
    float: left;
    margin-right: 10px;
  }
`

const StyledExampleBadge = styled.div`
  float: left;
  margin-bottom: 10px;
  margin-right: 6px;
`

export default function HelpPageContent () {
  return (
    <div>
      <TermsTypography variant='h1'>Help Center</TermsTypography>
      <div id='impact' style={{ paddingTop: '40px' }}>
        <TermsTypography variant='h2'>Impact</TermsTypography>
        <TermsTypography>Impact is measured by estimating the importance of functions. This estimate relies on their location in the function call graph and the amount of work done on them.</TermsTypography>
        <TermsTypography>The algorithm used is called <i>Dev Rank</i>. The algorithm&apos;s output is called <i>Dev Share</i>.</TermsTypography>
        <TermsTypography>Dev Share incorporates:</TermsTypography>
        <TermsTypography component='ul'>
          <li>The centrality of a function within the call graph</li>
          <li>The number of edits performed on the function</li>
          <li>The length of the function</li>
        </TermsTypography>
        <TermsTypography>For a detailed technical explanation see <a href='https://www2.eecs.berkeley.edu/Pubs/TechRpts/2018/EECS-2018-174.pdf'>Towards Quantifying the Development Value of Code Contributions</a> by Ren, Yin, et al.</TermsTypography>
      </div>
      <div id='productivity' style={{ paddingTop: '40px' }}>
        <TermsTypography variant='h2'>Productivity</TermsTypography>
        <TermsTypography>
          Productivity measures the amount of work performed. To avoid the noisiness of signals like lines of code (LOC) and commit count, the underlying unit of measure is ELOC, which is a Merico invention.
        </TermsTypography>
      </div>
      <div id='eloc' style={{ paddingTop: '40px' }}>
        <TermsTypography variant='h3'>ELOC</TermsTypography>
        <TermsTypography>
          ELOC is less noisy than the metrics commonly used for this same task, including lines of code (LOC) and commits. &nbsp;
          <a href='https://playground.mericobuild.com' target='_blank' rel='noreferrer'>
            Visit ELOC Playground
          </a>
        </TermsTypography>
        <TermsTypography component='ul'>
          <ul>
            <li>LOC is flawed in that different coding conventions have a big impact. One developer may put a newline after the beginning of a compound statement, while another may not. One developer may write verbose comments, but less code.</li>
            <li>Commits are flawed in that they measure workflows rather than labor. One developer may deliver a lot of short bursts, while another may make a few big deliveries.</li>
          </ul>
        </TermsTypography>
        <TermsTypography>It is constructed in steps. First, source code is converted into an <a href='https://en.wikipedia.org/wiki/Abstract_syntax_tree'>abstract syntax tree</a>:</TermsTypography>
        <TermsTypography component='div'>
          <StyledQuote>In computer science, an abstract syntax tree (AST), or just syntax tree, is a tree representation of the abstract syntactic structure of source code written in a programming language. Each node of the tree denotes a construct occurring in the source code.</StyledQuote>
        </TermsTypography>
        <TermsTypography component='div'>
          <StyledQuote>The syntax is &quot;abstract&quot; in the sense that it does not represent every detail appearing in the real syntax, but rather just the structural or content-related details. For instance, grouping parentheses are implicit in the tree structure, so these do not have to be represented as separate nodes.
          </StyledQuote>
        </TermsTypography>
        <TermsTypography>This conversion strip out lines of code which would create noise in an LOC metric. Comments are removed and many syntax conventions are standardized.</TermsTypography>
        <TermsTypography>Next, the syntax tree is normalized into a form which generates roughly the same amount of code regardless of the programming language. This enables code written in less-verbose languages to be compared to code written in more-verbose ones.</TermsTypography>
        <TermsTypography>The previous and latest versions of the code are then run through <a href='https://en.wikipedia.org/wiki/Diff'>diff</a>. Regardless of whether a modification was deletion, modification and addition, diff produces one line of output. Thus the type of the change is irrelevant, and all that matters is the size of the change.</TermsTypography>
        <TermsTypography>Lastly, the number of lines in the diff - one per AST node - are counted.</TermsTypography>
        <TermsTypography>For a commit which removes five nodes (as they appear in the normalized form of the abstract syntax tree), edits one, and adds six, ELOC will be 5+1+6 = 7.</TermsTypography>
      </div>
      <div id='quality' style={{ paddingTop: '40px' }}>
        <TermsTypography variant='h2'>Quality</TermsTypography>
        <TermsTypography>Quality is a composite measure which blends multiple related metrics, including:</TermsTypography>
        <TermsTypography component='ol'>
          <li>Doc coverage</li>
          <li>Test coverage</li>
          <li>Reusability</li>
          <li>Modularity</li>
        </TermsTypography>
        <TermsTypography>The sub-metrics are weighted, with weights summing up to 1. </TermsTypography>
        <TermsTypography>The total score is normalized to a value between 0 and 100.</TermsTypography>
      </div>
      <div id='doc-coverage' style={{ paddingTop: '40px' }}>
        <TermsTypography variant='h2'>Doc coverage</TermsTypography>
        <TermsTypography>Doc Coverage measures how well commented the code is. It is the ratio of functions with comments to functions without comments. </TermsTypography>
        <TermsTypography>A function needs only one comment. This comment can be within the function body or immediately preceding the function.</TermsTypography>
        <TermsTypography>A special syntax like <a href='https://en.wikipedia.org/wiki/Javadoc'>Javadoc</a> is not necessary. Any comment as defined by the language specification is sufficient.</TermsTypography>
        <TermsTypography>The formula is:</TermsTypography>
        <TermsTypography component='div'>
          <StyledCode>
            (doc-covered functions written by developer d in repo r) /
            (functions written by developer d in repo r)
          </StyledCode>
        </TermsTypography>
      </div>
      <div id='test-coverage' style={{ paddingTop: '40px' }}>
        <TermsTypography variant='h2'>Test coverage</TermsTypography>
        <TermsTypography>Test coverage is the proportion of code covered by unit tests. It is the ratio of:</TermsTypography>
        <TermsTypography component='div'>
          <StyledCode>
            (number of functions written by developer <strong>d</strong> in repo <strong>r</strong>) /
            (number of test-covered functions written by developer <strong>d</strong> in repo <strong>r</strong>)
          </StyledCode>
        </TermsTypography>
      </div>
      <div id='reusability' style={{ paddingTop: '40px' }}>
        <TermsTypography variant='h2'>Reusability</TermsTypography>
        <TermsTypography>Reusability measures redundant code. It is not an exact match, but a high-enough degree of similarity.</TermsTypography>
        <TermsTypography>It is the ratio between the number of duplicate and non-duplicate functions. A high number indicates lower redundancy.  More precisely, it is:</TermsTypography>
        <TermsTypography component='div'>
          <StyledCode>
            (duplicated functions written by developer <strong>d</strong> in repo <strong>r</strong>) /
            (functions written by developer <strong>d</strong> in repo <strong>r</strong>)
          </StyledCode>
        </TermsTypography>
      </div>
      <div id='modularity' style={{ paddingTop: '40px' }}>
        <TermsTypography variant='h2'>Modularity</TermsTypography>
        <TermsTypography>Modularity provides of how independent and interchangeable components within the codebase are.</TermsTypography>
        <TermsTypography>We use a heuristic algorithm to find the best partition of the codebase in each language in the repo so that it achieves the highest modularity, then do a weighted average across languages.</TermsTypography>
        <TermsTypography>Because modularity needs to cover a complete codebase rather than a single commit, it is computed for an entire repo, including contributions by all developers. As a result all contributors to that repo have the same modularity score. </TermsTypography>
        <TermsTypography>To combine modularity scores across repos, the developer&apos;s share of that code base is weighted using the developer&apos;s ELOC in each project.</TermsTypography>
        <TermsTypography>An Example of Computing a Developer&apos;s Modularity</TermsTypography>
        <TermsTypography component='ul'>
          <li>
            Developer&apos;s modularity across projects =
            <ul>
              <li>
                <StyledCode>
                  &#x0007B; project A: 50, project B: 60, project C: 70 &#x0007D;
                </StyledCode>
              </li>
            </ul>
          </li>
          <li>
            Developer&apos;s ELOC across projects =
            <ul>
              <li>
                <StyledCode>
                  &#x0007B; project A: 100, project B: 50, project C: 50 &#x0007D;
                </StyledCode>
              </li>
            </ul>
          </li>
          <li>
            Modularity of developer, with weights highlighted =
            <ul>
              <li>
                <StyledCode>
                  (100 * 50 + 50 * 60 + 50 * 70) / (100 + 50 + 50)
                </StyledCode>
              </li>
            </ul>
          </li>
        </TermsTypography>
      </div>
      <div id='badges' style={{ paddingTop: '40px' }}>
        <TermsTypography variant='h2'>Badges</TermsTypography>

        <TermsTypography variant='h3'>Definition</TermsTypography>
        <TermsTypography>
          Merico Build provides badges to enable developers to communicate their accomplishments. They are intended to encourage learning, demonstrate skill, and encourage self-improvement.
        </TermsTypography>

        <TermsTypography variant='h3'>Image Components</TermsTypography>
        <TermsTypography>
          <BadgeExample style={{ cssFloat: 'left', marginRight: '30px', marginBottom: '15px' }} />
          <TermsTypography>
            Exportable images facilitate sharing outside of the site. Images are in SVG format. Right click and &ldquo;Save Image As...&rdquo; to download.
          </TermsTypography>
          <TermsTypography>
            (It is better to export by sharing the web page containing the image because that provides details to substantiate claims, explain the criteria, and show that the issuer is credible. Use the &ldquo;Share&rdquo; button).
          </TermsTypography>
        </TermsTypography>

        <TermsTypography variant='h3'>Types</TermsTypography>

        <TermsTypography variant='type'>
          <BadgeLinguistTypeIcon style={{ cssFloat: 'left', marginTop: '2px', marginRight: '8px' }} width='20' height='20' />
          Linguist
        </TermsTypography>
        <TermsTypography>
          <strong>Description</strong><br />
          Shows depth of experience in a single programming language.
        </TermsTypography>
        <TermsTypography>
          <strong>Criteria</strong><br />
          Merico Build analyzes commits to all repositories submitted by the developer. Only code in commits by emails claimed by the developer is included. The unit of measure is ELOC - see below for more information.
        </TermsTypography>

        <TermsTypography variant='type'>
          <BadgeMultilingualTypeIcon style={{ cssFloat: 'left', marginTop: '2px', marginRight: '8px' }} width='20' height='20' />
          Multilingual
        </TermsTypography>
        <TermsTypography>
          <strong>Description</strong><br />
          Shows broad experience in 3 or more programming languages.
        </TermsTypography>
        <TermsTypography>
          <strong>Criteria</strong><br />
          Merico Build analyzes commits to all repositories submitted by the developer. Only code in commits by emails claimed by the developer is included. The unit of measure is ELOC - see above for more information.
        </TermsTypography>

        <TermsTypography variant='type'>
          <BadgeTrailblazerTypeIcon style={{ cssFloat: 'left', marginTop: '2px', marginRight: '8px' }} width='20' height='20' />
          Trailblazer
        </TermsTypography>
        <TermsTypography>
          <strong>Description</strong><br />
          Shows founding or early-stage contributions to a significant project.
        </TermsTypography>
        <TermsTypography>
          <strong>Criteria</strong><br />
          Merico Build analyzes commits to a repository to to verify that the badge recipient was one of the earliest contributors. The medal system shows <strong>how</strong> early. There must be at least five committers.
        </TermsTypography>

        <TermsTypography variant='type'>
          <BadgeContributionTypeIcon style={{ cssFloat: 'left', marginTop: '2px', marginRight: '8px' }} width='20' height='20' />
          Contribution
        </TermsTypography>
        <TermsTypography>
          <strong>Description</strong><br />
          Shows that commits to a project have been accepted. Whether it is a project worth bragging about is up to the developer.
        </TermsTypography>
        <TermsTypography>
          <strong>Criteria</strong><br />
          The developer must have had commits accepted.
        </TermsTypography>

        <TermsTypography variant='type'>
          <BadgeTopContributorTypeIcon style={{ cssFloat: 'left', marginTop: '2px', marginRight: '8px' }} width='20' height='20' />
          Top Contributor
        </TermsTypography>
        <TermsTypography>
          <strong>Description</strong><br />
          Shows a leading contribution to a non-trivial project, with the degree of contribution expressed using the medal system.
        </TermsTypography>
        <TermsTypography>
          <strong>Criteria</strong><br />
          The project must have at least five contributors. Contributors with multiple emails are aggregated into single entries.
        </TermsTypography>

        <TermsTypography variant='type'>
          <BadgeMinesweeperTypeIcon style={{ cssFloat: 'left', marginTop: '2px', marginRight: '8px' }} width='20' height='20' />
          Minesweeper
        </TermsTypography>
        <TermsTypography>
          <strong>Description</strong><br />
          Shows that the developer has reduced the complexity of highly risky code. Risky means cyclomatic complexity greater than nine.
        </TermsTypography>
        <TermsTypography>
          <strong>Criteria</strong><br />
          The repository must have at least 1000 ELOC.
        </TermsTypography>

        <TermsTypography variant='type'>
          <BadgeTestOfTimeTypeIcon style={{ cssFloat: 'left', marginTop: '2px', marginRight: '8px' }} width='22' height='22' />
          Test of Time
        </TermsTypography>
        <TermsTypography>
          <strong>Description</strong><br />
          Shows that this developer&apos;s code appears to be high quality because it is rarely modified by other developers.
        </TermsTypography>
        <TermsTypography>
          <strong>Criteria</strong><br />
          A function is considered to have passed the test of time if its content remains largely unchanged from its initial version to its current version. Very small changes won’t cause the function to fail.
        </TermsTypography>

        <TermsTypography variant='h3'>Medals</TermsTypography>
        <TermsTypography>
          Every badge comes with a medal to indicate the level of that particular badge. The medal is determined using this algorithm:
        </TermsTypography>
        <div>
          <TermsTypography component='ol' variant='list' style={{ margin: 0, paddingLeft: '18px' }}>
            <li style={{ marginBottom: '12px' }}>
              Collect a dataset of developers and repositories to use for benchmarks. This set will remain unchanged in order to keep scores stable.
            </li>
            <li style={{ marginBottom: '12px' }}>
              Calculate the number of developers, including the badge recipient, taking developers with multiple email addresses into account.
            </li>
            <li style={{ marginBottom: '12px', clear: 'both' }}>
              If the number of developers is <strong>greater</strong> than ten:
              <StyledMedalGrades>
                <StyledMedalGradeItem>
                  <StyledMedalGradeIcon className='gold' /> Top 10% - Gold
                </StyledMedalGradeItem>
                <StyledMedalGradeItem>
                  <StyledMedalGradeIcon className='silver' /> Top 11%-25% - Silver
                </StyledMedalGradeItem>
                <StyledMedalGradeItem>
                  <StyledMedalGradeIcon className='bronze' /> Top 26%-50% - Bronze
                </StyledMedalGradeItem>
                <StyledMedalGradeItem>
                  <StyledMedalGradeIcon className='iron' /> Top 51%-80% - Iron
                </StyledMedalGradeItem>
                <StyledMedalGradeItem>
                  <StyledMedalGradeIcon className='locked'><Padlock width='12' height='12' /></StyledMedalGradeIcon> Top 81%-100% - Locked
                </StyledMedalGradeItem>
              </StyledMedalGrades>
            </li>
            <li style={{ marginBottom: '12px', clear: 'both' }}>
              If the number of developers is <strong>less</strong> than ten:

              <StyledMedalGrades>
                <StyledMedalGradeItem>
                  <StyledMedalGradeIcon className='gold' /> No. 1 - Gold
                </StyledMedalGradeItem>
                <StyledMedalGradeItem>
                  <StyledMedalGradeIcon className='silver' /> No. 2-3- Silver
                </StyledMedalGradeItem>
                <StyledMedalGradeItem>
                  <StyledMedalGradeIcon className='bronze' /> No. 4-5 - Bronze
                </StyledMedalGradeItem>
                <StyledMedalGradeItem>
                  <StyledMedalGradeIcon className='iron' /> No. 6-8 - Iron
                </StyledMedalGradeItem>
                <StyledMedalGradeItem>
                  <StyledMedalGradeIcon className='locked'><Padlock width='12' height='12' /></StyledMedalGradeIcon> No. 9-10 - Locked
                </StyledMedalGradeItem>
              </StyledMedalGrades>
            </li>
          </TermsTypography>
        </div>

        <TermsTypography style={{ clear: 'both' }}>
          Example Badges:
        </TermsTypography>
        <div>
          <StyledExampleBadge><LinguistExampleBadgeGold width='160' height='91' /></StyledExampleBadge>
          <StyledExampleBadge><LinguistExampleBadgeSilver width='160' height='91' /></StyledExampleBadge>
          <StyledExampleBadge><LinguistExampleBadgeBronze width='160' height='91' /></StyledExampleBadge>
          <StyledExampleBadge><LinguistExampleBadgeIron width='160' height='91' /></StyledExampleBadge>
          <StyledExampleBadge><LinguistExampleBadgeLocked width='160' height='91' /></StyledExampleBadge>
        </div>

      </div>
      <div id='merges' style={{ paddingTop: '140px', paddingBottom: '400px' }}>
        <TermsTypography variant='h2'>Merges</TermsTypography>

        <TermsTypography variant='h3'>Definition</TermsTypography>
        <TermsTypography>
          Merges are events that happen in a source code management application such as Github or Gitlab. In Github, these are called 'Pull Requests' and in Gitlab, they are called 'Merge Requests'. Developers can open these requests in order to merge new code into the main branch of the project.
        </TermsTypography>
        <TermsTypography>
          There are several events that can happen with a Merge. The main event we track is when a Pull Request is actually merged and the new code becomes part of the main branch. Pull requests can also be closed without merging. These events are not tracked.
        </TermsTypography>
      </div>
    </div>
  )
}
