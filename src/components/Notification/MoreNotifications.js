import React from 'react'
import styled from '@emotion/styled'

const StyledMoreNotifications = styled.div`
  font-size: 10px;
  background-color: #f6f6f6;
  color: #888888;
  padding: 6px 6px;
  display: flex;
  justify-content: space-between;
`

const StyledMoreNotificationsMessage = styled.strong`
  line-height: 20px;
`

const StyledButtonClearNotifications = styled.span`
  cursor: pointer;
  background-color: #ffffff;
  text-align: center;
  padding: 0 8px;
  border-radius: 12px;
  height: 20px;
  line-height: 17px;
  border: 2px solid #cccccc;

  &:hover {
    border-color: #ED6A45;
    background-color: #ED6A45;
    color: #ffffff;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.15);
    transition: all 0.4s ease;
  }
`

export default function MoreNotifications (props) {
  const {
    getVisibleNotificationsCount,
    panelOpened,
    panelClosed,
    allRead,
    notificationsCount,
    maxNotifications,
    clearNotifications
  } = props

  if (
    getVisibleNotificationsCount() > 0 &&
    panelOpened && !panelClosed && !allRead &&
    notificationsCount > maxNotifications
  ) {
    return (
      <StyledMoreNotifications>
        <StyledMoreNotificationsMessage>
          + {notificationsCount - maxNotifications} more notification(s)
        </StyledMoreNotificationsMessage>
        <StyledButtonClearNotifications onClick={clearNotifications}>
          CLEAR ALL
        </StyledButtonClearNotifications>
      </StyledMoreNotifications>
    )
  }
  return (null)
}
