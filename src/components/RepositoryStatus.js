import React from 'react'
import { Trans } from '@lingui/macro'
import {
  Typography, withStyles
} from '@material-ui/core'

import { ReactComponent as QuestionCircle } from '@/icons/question-circle.svg'
import { Readiness } from '@/enums/repositoryReadiness'
import HelpPopover from '@/components/HelpPopover'

const StyledTypography = withStyles({
  body1: {
    fontSize: 'inherit'
  }
})(Typography)

const Status = ({ status, explain }) => (
  <div>
    <StyledTypography variant='body1'>
      {status}
      {(
          explain
            ? (
              <>
                &nbsp;
                <HelpPopover
                  content={explain}
                  style={{
                    marginLeft: '5px',
                    transform: 'translateY(2px)',
                    display: 'inline-block'
                  }}
                >
                  <QuestionCircle width='17.5' hight='17.5' />
                </HelpPopover>
              </>
              )
            : null
      )}
    </StyledTypography>
  </div>
)

export default function RepositoryStatus (props) {
  const {
    status,
    progress,
    errorMessage
  } = props

  switch (status) {
    case Readiness.NOT_INIT:
      return (
        <Status
          status={<Trans>Authorizing...</Trans>}
          explain={(
            <Trans>Code has changed. Check to see if it can be pulled.</Trans>
        )}
        />
      )
    case Readiness.AUTH_REQUIRE:
      return (
        <Status
          status={<Trans>Unauthorized</Trans>}
          explain={(
            <Trans>
              Unable to pull code because of a problem with the username or password
            </Trans>
        )}
        />
      )
    case Readiness.WAITING:
      return (
        <Status
          status={<Trans>Queued</Trans>}
          explain={(
            <Trans>
              Authorization successful. In line for the analysis engine.
            </Trans>
          )}
        />
      )
    case Readiness.PRE_UNDERWAY:
      return (
        <Status
          status={<Trans>Pre-analysis running</Trans>}
          explain={(
            <Trans>
              Running pre-analysis. This stage is usually two minutes.
            </Trans>
          )}
        />
      )
    case Readiness.PRE_READY:
      return (
        <Status
          status={<Trans>Pre-analysis complete</Trans>}
          explain={(
            <Trans>
              Pre-analysis complete.
              We can now get the language proportion,
              number of developers, and number of submissions.
            </Trans>
          )}
        />
      )
    case Readiness.UNDERWAY:
      if (progress) {
        return (
          <Status
            status={(
              <>
                <Trans>Full analysis running:</Trans> {Number((progress * 100).toFixed(1))}%
              </>
            )}
            explain={(
              <Trans>
                Running a full analysis on each commit...
              </Trans>
          )}
          />
        )
      }
      return (
        <Status
          status={<Trans>Full analysis running</Trans>}
          explain={(
            <Trans>
              Running a full analysis on each commit...
            </Trans>
          )}
        />
      )

    case Readiness.READY:
      return (
        <Status
          status={<Trans>Analysis complete</Trans>}
          explain={(
            <Trans>
              The analysis completed successfully.
            </Trans>
          )}
        />
      )
    case Readiness.PULLING:
      return (
        <Status
          status={<Trans>Preparing report...</Trans>}
          explain={(
            <Trans>
              Converting analysis results into user-visible data...
            </Trans>
          )}
        />
      )
    case Readiness.FAILURE:
      return (
        <Status
          status={errorMessage || <Trans>System error</Trans>}
          explain={errorMessage
            ? null
            : (
              <Trans>
                The analysis engine had an unexpected problem. Please restart processing.
              </Trans>
              )}
        />
      )
    case Readiness.UNKNOWN:
      return (
        <Status
          status={<Trans>Unknown error</Trans>}
          explain={(
            <Trans>
              The analysis engine had an unknown problem. Please restart processing.
            </Trans>
          )}
        />
      )
    case Readiness.NOT_REPO:
      return (
        <Status
          status={<Trans>Not a repo</Trans>}
          explain={(
            <Trans>
              Either the project is not a git repository or the repository does not contain code.
            </Trans>
)}
        />
      )
    case Readiness.UNSUPPORTED:
      return (
        <Status
          status={<Trans>Unsupported language</Trans>}
          explain={(
            <Trans>
              The repository contains an unsupported language.
            </Trans>
          )}
        />
      )
    default:
      return (<></>)
  }
}
