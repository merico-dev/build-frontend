import React, { useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { smMedia } from '@/styles/snippets/responsive'

import { ReactComponent as NotificationLoadingIcon } from '@/icons/notification-loader.svg'
import NoneAvailable from '@/components/Notification/NoneAvailable'
import MoreNotifications from '@/components/Notification/MoreNotifications'

import './styles.css'

const StyledNotificationPanel = styled.div`
  overflow: hidden;
  position: fixed;
  top: 60px;
  left: 0;
  width: 100%;
  min-height: 32px;
  background-color: #ffffff;
  padding: 0;
  font-size: 12px;
  border-radius: 4px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  color: #717484;

  ${smMedia(css`
    position: absolute;
    top: 80px;
    left: auto;
    right: 50px;
    width: 400px;
  `)}
`

const StyledCloseNotificationsIcon = styled.span`
  position: absolute;
  right: 10px;
  cursor: pointer;
  margin: 8px 12px 8px 8px;
  line-height: 18px;
  float: right;
  font-size: 24px;
  color: #777777;
  transition: all 0.3s ease;

  &:hover {
    color: #222222;
  }

  ${smMedia(css`
    right: 0;
  `)}
`

const StyledNotificationsList = styled.div`
  padding: 0;
`

const StyledNotificationLoading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;

  &.no-items {
    /* position: absolute;
    bottom: 0;
    left: 0; */
    border-top: 1.0px solid #f0f0f0;
  }
`

export default function NotificationPanel (props) {
  const {
    isLoading,
    panelOpened,
    panelClosed,
    closeNotifications,
    clearNotifications,
    notificationsList,
    notificationsCount
  } = props
  // FIXME: why we use this setter?
  // eslint-disable-next-line no-unused-vars
  const [maxNotifications, setMaxNotifications] = useState(3)
  // FIXME: why we use this setter?
  // eslint-disable-next-line no-unused-vars
  const [allRead, setAllRead] = useState(false)

  const getVisibleNotificationsCount = () => {
    return notificationsList.filter((item) => item.props.visible).length
  }

  return (
    <StyledNotificationPanel>
      <StyledCloseNotificationsIcon
        onClick={closeNotifications}
      > &times;
      </StyledCloseNotificationsIcon>
      <StyledNotificationsList>
        <TransitionGroup>
          {notificationsList.slice(0, maxNotifications)}
        </TransitionGroup>
        <CSSTransition
          in={panelOpened}
          timeout={300}
          classNames='notification-item'
          unmountOnExit
        >
          <NoneAvailable
            isLoading={isLoading}
            getVisibleNotificationsCount={getVisibleNotificationsCount}
          />
        </CSSTransition>
        <CSSTransition
          in={panelOpened}
          timeout={300}
          classNames='notification-item'
          unmountOnExit
        >
          <MoreNotifications
            getVisibleNotificationsCount={getVisibleNotificationsCount}
            panelOpened={panelOpened}
            panelClosed={panelClosed}
            allRead={allRead}
            notificationsCount={notificationsCount}
            maxNotifications={maxNotifications}
            clearNotifications={clearNotifications}
          />
        </CSSTransition>
      </StyledNotificationsList>
      {
        !panelOpened && (
          // eslint-disable-next-line max-len
          <StyledNotificationLoading className={getVisibleNotificationsCount() === 0 ? 'no-items' : ''}><NotificationLoadingIcon width='74px' height='9px' /></StyledNotificationLoading>
        )
      }
    </StyledNotificationPanel>
  )
}
