import React, { useState, useRef, useEffect } from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { smMedia } from '@/styles/snippets/responsive'

import { ReactComponent as NotificationBadgeTypeIcon } from '@/icons/notification-badge.svg'
import { ReactComponent as NotificationRepositoryTypeIcon } from '@/icons/notification-repository.svg'
import { ReactComponent as NotificationAccountTypeIcon } from '@/icons/notification-account.svg'

import './styles.css'

const StyledNotificationItem = styled.div`
  display: flex;
  width: 100%;
  margin: 0;
  padding: 8px;
  border-bottom: 1.0px solid #f0f0f0;
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &:hover {
    background-color: #fafafa;
  }

  .no-action-url {
    align-self: center;
  }
`

const StyledNotificationType = styled.div`
  min-width: 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const StyledNotification = styled.div`
  padding-left: 10px;
  padding-right: 36px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${smMedia(css`
    padding-right: 23px;
  `)}

`

const StyledNotificationMessage = styled.span`

`

const StyledNotificationActionLink = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: #ED6A45;
  transition: all 0.4s ease;
  width: 100px;

  &:hover {
    color: #444444;
  }

  &.disabled {
    pointer-events: none;
    color: #777777;
    opacity: 0.6;
  }
`

export default function NotificationItem (props) {
  const {
    notification,
    readNotification,
    notificationsCount,
    closeItem,
    isLoading,
    visible,
    handleViewNotificationRedirect
  } = props

  const [isVisible, setIsVisible] = useState(false)
  // FIXME: why do we have isClosed?
  // eslint-disable-next-line no-unused-vars
  const [isClosed, setIsClosed] = useState(false)
  const isMountedRef = useRef(false)

  const viewNotification = () => {
    // Perform Additional operations before Redirect
    // ...
    handleViewNotificationRedirect(notification.url)
  }

  const markNotificationRead = async (skipRedirect = false) => {
    readNotification(notification)
    if (!skipRedirect && notification.url !== '') {
      viewNotification()
    }
  }

  const closeNotification = (skipRedirect = false, e) => {
    e.stopPropagation()
    if (isLoading) { return }
    setIsVisible(false)
    setIsClosed(true)
    closeItem(notification.id)
    markNotificationRead(skipRedirect)
  }

  const NotificationTypeIcon = () => {
    let typeIcon = null
    if (notification.type === 'repository') {
      typeIcon = <NotificationRepositoryTypeIcon width={22} height={26} fill='#ED6A45' />
    } else if (notification.type === 'account') {
      typeIcon = <NotificationAccountTypeIcon width={18} height={18} fill='#aaaaaa' />
    } else if (notification.type === 'badge') {
      typeIcon = <NotificationBadgeTypeIcon width={22} height={26} />
    }
    return typeIcon
  }

  useEffect(() => {
    // let isMounted = true;
    isMountedRef.current = true
    if (isMountedRef.current) {
      setIsVisible(visible)
    }

    return () => {
      // isMounted = false;
      isMountedRef.current = false
    }
  }, [visible])

  return (
    <CSSTransition
      in={isVisible}
      key={notification.id}
      timeout={300}
      classNames='notification-item'
      unmountOnExit
    >
      <StyledNotificationItem onClick={(e) => closeNotification(true, e)} className={notificationsCount === 1 ? 'only-one' : ''}>
        <StyledNotificationType>
          <NotificationTypeIcon width={22} height={26} />
        </StyledNotificationType>
        <StyledNotification>
          <StyledNotificationMessage
            className={
              notification.url === ''
                ? 'no-action-url'
                : ''
            }
          >{notification.message}
          </StyledNotificationMessage>
          <StyledNotificationActionLink onClick={(e) => closeNotification(false, e)} className={isLoading ? 'disabled' : ''}>
            {notification.url !== '' ? 'Learn more' : ''}
          </StyledNotificationActionLink>
        </StyledNotification>
      </StyledNotificationItem>
    </CSSTransition>
  )
}
