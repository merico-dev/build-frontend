// FIXME: Remove unused lines from success and porocess confirmation
import React from 'react'
import styled from '@emotion/styled'

import { ReactComponent as ExclamationCircle } from '@/icons/exclamation-circle.svg'
import { ReactComponent as TimesCircle } from '@/icons/times-circle.svg'
// import { ReactComponent as CheckCircle } from '@/icons/check-circle.svg';
import { LOADING } from '@/store/statusTypes'
import FetchStatus from '@/components/FetchStatus'
// import { postData } from '@/utils/fetchData';

const StyledRepositoryStatusItem = styled.div`
  font-size: var(--text-md);
  line-height: 1.2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-align: center;
  justify-content: flex-start;
  color: var(--color-gray-500);
  margin-bottom: 10px;

  &:last-of-type {
    margin-bottom: 0;
  }
`

const StyledTimesCircle = styled(TimesCircle)`
  color: #EE5858;
  margin-right: 6px;
`
const StyledExclamationCircle = styled(ExclamationCircle)`
  color: #FAAD14;
  margin-right: 6px;
`
// const StyledCheckCircle = styled(CheckCircle)`
//   color: #52C41A;
//   margin-right: 6px;
// `;

const StyledRepositoryName = styled.div`
  margin-right: 10px;
  font-size: var(--text-md);
`

const StyledRepositoryMessage = styled.div`
  width: 100%;
  font-size: var(--text-xs);
  text-align: left;
  color: ${({ color }) => color};
  padding: 4px 0 0 28px;
`

// const StyledRepositoryConfirmSuccess = styled.div`
//   margin-left: auto;
//   display: flex;
//   align-items: center;
// `;

// const StyledButton = withStyles({
//   root: {
//     marginLeft: 'auto'
//   }
// })(Button);

// const REPOSITORY_LOADING = 'REPOSITORY_LOADING';
// const REPOSITORY_SUCCED = 'REPOSITORY_SUCCED';
// const REPOSITORY_FAILED = 'REPOSITORY_FAILED';

export default function RepositoryStatusMessage ({ response }) {
  // const [repositoriesFeedback, setRepositoriesFeedback] = useState([]);
  // const forceSubmit = async (repository) => {
  //   const replaceStatus = (feedback, status) => {
  //     return [
  //       ...feedback.filter(({ gitUrl }) => gitUrl !== repository.gitUrl),
  //       status
  //     ];
  //   };

  //   // set repository loading
  //   setRepositoriesFeedback((feedback) => replaceStatus(feedback, {
  //     gitUrl: repository.gitUrl,
  //     status: REPOSITORY_LOADING
  //   }));

  //   try {
  //     const {
  //       successes
  //     } = await postData('projects?force=1', { projects: [repository] });

  //     // repository successfully imported
  //     if (successes.length) {
  //       setRepositoriesFeedback((feedback) => replaceStatus(feedback, {
  //         gitUrl: repository.gitUrl,
  //         status: REPOSITORY_SUCCED
  //       }));
  //       return;
  //     }

  //     // repository failed to import
  //     setRepositoriesFeedback((feedback) => replaceStatus(feedback, {
  //       gitUrl: repository.gitUrl,
  //       status: REPOSITORY_FAILED
  //     }));
  //   } catch (e) {
  //     setRepositoriesFeedback((feedback) => replaceStatus(feedback, {
  //       gitUrl: repository.gitUrl,
  //       status: REPOSITORY_FAILED
  //     }));
  //   }
  // };

  if (response === null) {
    return (
      <FetchStatus
        status={LOADING}
      />
    )
  }

  let responseMarkup = []

  const filledResponse = {
    successes: response?.successes || [],
    failures: response?.failures || [],
    warnings: response?.warnings || [],
  }

  responseMarkup = [
    // ...filledResponse.successes.map((item, index) => {
    //   return (
    //     // eslint-disable-next-line react/no-array-index-key
    //     <StyledRepositoryStatusItem key={`${item.name}${index}`}>
    //       <StyledCheckCircle width="19.25" height="19.25" />
    //       <StyledRepositoryName>{item.name}</StyledRepositoryName>
    //     </StyledRepositoryStatusItem>
    //   );
    // }),
    ...filledResponse.failures.map((item, index) => {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <StyledRepositoryStatusItem key={`${item.project.name}${index}`}>
          <StyledTimesCircle width='19.25' height='19.25' />
          <StyledRepositoryName>{item.project.name}</StyledRepositoryName>
          <StyledRepositoryMessage color='#F5222D'>{item.message}</StyledRepositoryMessage>
        </StyledRepositoryStatusItem>
      )
    }),
    ...filledResponse.warnings.map((item, index) => {
      // const repositoryFeedback = repositoriesFeedback.find(
      //   ({ gitUrl }) => gitUrl === item.project.gitUrl
      // );
      return (
        // eslint-disable-next-line react/no-array-index-key
        <StyledRepositoryStatusItem key={`${item.project.name}${index}`}>
          <StyledExclamationCircle width='19.25' height='19.25' />
          <StyledRepositoryName>{item.project.name}</StyledRepositoryName>
          <StyledRepositoryMessage color='#E19704'>{item.message}</StyledRepositoryMessage>
          {/* { repositoryFeedback?.status === REPOSITORY_SUCCED ? (
            <StyledRepositoryConfirmSuccess>
              <StyledCheckCircle width="19.25" height="19.25" />Successfully imported
            </StyledRepositoryConfirmSuccess>
          ) : (
            <StyledButton
              variant="contained"
              color="primary"
              size="small"
              onClick={() => forceSubmit(item.project)}
              disabled={repositoryFeedback?.status === REPOSITORY_LOADING}
            >
              {repositoryFeedback?.status === REPOSITORY_LOADING ? (
                'Confirming'
              ) : (
                'Confirm'
              )}
            </StyledButton>
          )} */}
        </StyledRepositoryStatusItem>
      )
    })
  ]

  return responseMarkup
}
