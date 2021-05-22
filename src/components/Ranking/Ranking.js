import React, { useCallback, useEffect, useState } from 'react'
import queryString from 'query-string'
import styled from '@emotion/styled'
import { useSelector } from 'react-redux'
import { CustomDataGrid } from '@/components/CustomDataGrid/CustomDataGrid'
import CustomDataGridUser from '@/components/CustomDataGrid/CustomDataGridUser'
import CustomDataGridVariation from '@/components/CustomDataGrid/CustomDataGridVariation'
import { getUserAlias } from '@/utils/user/user'
import CustomDataGridHelp from '@/components/CustomDataGrid/CustomDataGridHelp'
import { InvitationDialog, sendContributorInvitation } from '@/components/Profile/Contributor/InvitationDialog'
import { ReactComponent as InvitationTriggerIcon } from '@/icons/invite-contributor.svg'
import {
  makeStyles
} from '@material-ui/core'
import Tooltip from '@material-ui/core/Tooltip'

const StyledInvitationTrigger = styled.div`
  cursor: pointer;
  text-decoration: none;
  outline: none;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;

    > span > svg > path {
      fill: #888888 !important;
    }
  }
`

const tooltipStyles = makeStyles((theme) => ({
  root: {
    fontSize: '18px',
    backgroundColor: '#ffffff'
  },
  popper: {
  },
  tooltip: {
    fontSize: '13px',
    backgroundColor: '#ffffff',
    color: '#717484',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    maxWidth: '133px'
  },
  tooltipArrow: {
  },
  arrow: {
    color: '#ffffff'
  }
}))

const defaultSortField = 'productivity'
const defaultSortOrder = 'desc'
const sortFieldOptions = ['productivity', 'name', 'rank', 'impact']

const getSortFieldOrDefault = (sortField) => {
  return sortFieldOptions.includes(sortField) ? sortField : defaultSortField
}

export const getRankingItem = (item, id, sortModelField) => {
  return {
    ...item,
    userAlias: getUserAlias(item),
    productivity: item.productivity,
    impact: !isNaN(item.impact) ? Number(item.impact).toFixed(2) : 0,
    id: id,
    rank: sortModelField === 'impact'
      ? item?.impactRank
      : item?.productivityRank
  }
}

export default function Ranking (props) {
  const {
    height,
    rows,
    hideFooterPagination,
    page,
    onContributorClick = () => {},
    gitUrl
  } = props
  const user = useSelector((state) => state.user)
  const isAuthenticated = useSelector((state) => state.user.status === 'SUCCEED')
  const [rankingRows, setRankingRows] = useState([])
  const [isFetching, setIsFetching] = useState(true)
  const [sortModel, setSortModel] = useState({
    field: defaultSortField,
    sort: defaultSortOrder
  })
  const {
    start: initialStartDate,
    end: initialEndDate,
    sort: initialSortField = defaultSortField,
    gitUrl: initialGitUrl = ''
  } = queryString.parse(window.location.search)

  const [contributorEmail, setContributorEmail] = useState()
  const [invitationGitUrl, setInvitationGitUrl] = useState()
  const [inviteDialog, setInviteDialog] = useState(false)

  const tooltipClasses = tooltipStyles(props)

  useEffect(() => {
    if (Array.isArray(rows)) {
      setIsFetching(false)
      setRankingRows(rows.map(
        (rank, idx) => getRankingItem(rank, idx, sortModel.field)
      ))
    }
  }, [sortModel.field, isFetching, rows])

  const columns = [
    {
      field: 'rank',
      headerName: 'Rank',
      sortable: false,
      flex: 0,
      width: 112,
      renderCell: ({ value }) => (
        <CustomDataGridVariation variation={value} />
      )
    },
    {
      field: 'invite',
      headerName: ' ',
      sortable: false,
      flex: 0,
      width: 36,
      columnAlign: 'center',
      renderCell: (params) => (
        isAuthenticated && !isUserCurrentUser(params?.row?.emails[0]) && params?.row?.userId === null &&
        (
          <StyledInvitationTrigger
            onClick={() => inviteUser(params?.row?.emails[0])}
            className={inviteDialog ? 'disabled' : ''}
            data-test='ranking-contributor-invite-trigger'
          >
            <Tooltip
              classes={tooltipClasses}
              title={`Invite "${params?.row?.displayName ?? 'contributor'}" for better data quality.`}
              placement='bottom'
              arrow
            >
              <span><InvitationTriggerIcon width='18' height='18' /></span>
            </Tooltip>
          </StyledInvitationTrigger>
        )
      )
    },
    {
      field: 'userAlias',
      headerName: 'Name',
      flex: 3,
      renderCell: (params) => (
        <CustomDataGridUser
          name={params.value}
          email={params?.row?.emails[0]}
          photo={params?.row?.photo}
          onClick={onContributorClick}
          // #1024 Do not Exclude Clicks for NO-REPLY Contributors
          // disableClick={['no-reply', 'noreply'].some((excludedEmail) => params?.row?.emails[0].includes(excludedEmail))}
          clickable
        />
      )
    },
    {
      field: 'productivity',
      headerName: (
        <CustomDataGridHelp
          help='The amount of code a contributor has written, measured in ELOC, a similar but less noisey metric than LOC'
          link='/help#eloc'
        >
          ELOC
        </CustomDataGridHelp>
      ),
      type: 'number',
      columnAlign: 'right',
      headerAlign: 'right'
    },
    {
      field: 'impact',
      headerName: (
        <CustomDataGridHelp
          help='The amount of impact a contributor’s code has on other contributors’ code in this repository'
          link='/help#impact'
        >
          Impact
        </CustomDataGridHelp>
      ),
      type: 'number',
      valueFormatter: ({ value }) => `${value}%`,
      columnAlign: 'right',
      headerAlign: 'right'
    },
    {
      field: 'merges',
      headerName: (
        <CustomDataGridHelp
          help='The amount of PR/MRs approved'
          link='/help#merges'
        >
          Merges
        </CustomDataGridHelp>
      ),
      type: 'number',
      columnAlign: 'right',
      headerAlign: 'right'
    }
  ]
  // TODO: Remove this if we can do on render
  useEffect(() => {
    setSortModel({
      field: getSortFieldOrDefault(initialSortField),
      sort: defaultSortOrder
    })
  }, [initialStartDate, initialEndDate, initialSortField, initialGitUrl])

  const onRankingSortChange = useCallback(({ sortModel }) => {
    if (sortModel?.length > 0) {
      setSortModel(sortModel[0])
    }
  }, [])

  const inviteUser = (email) => {
    setContributorEmail(email)
    setInvitationGitUrl(gitUrl !== '' ? gitUrl : initialGitUrl)
    setInviteDialog(true)
  }

  const onInviteDialogClose = () => {
    setInviteDialog(false)
  }

  const isUserCurrentUser = (email) => {
    return user?.data?.emails?.some((userEmail) => userEmail === email)
  }

  return (
    <>
      <CustomDataGrid
        sortModel={sortModel}
        isFetching={isFetching}
        dataRows={rankingRows}
        columns={columns}
        onSortModelChange={onRankingSortChange}
        height={height}
        hideFooterPagination={hideFooterPagination}
        page={page}
        autoHeight
        // getRowId={(row, index) => console.log(row, index) || row.gitUsername}
      />
      <InvitationDialog
        open={inviteDialog}
        contributorEmail={contributorEmail}
        gitUrl={invitationGitUrl}
        onDialogClose={onInviteDialogClose}
        onSend={sendContributorInvitation}
      />
    </>
  )
}
