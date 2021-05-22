import React, { useState, useEffect, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import styled from '@emotion/styled'

import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { SUCCEED } from '@/store/statusTypes'

import { fetchData, postData } from '@/utils/fetchData'

import NotificationPanel from '@/components/Notification/NotificationPanel'
import NotificationItem from '@/components/Notification/NotificationItem'
import NotificationTriggerIcon from '@/components/Notification/NotificationTriggerIcon'

import { MP, NotificationEvents } from '@/utils/mixpanel'

import './Notification/styles.css'

const StyledNotificationsWrapper = styled.div`
  padding-top: 5px;
`

const StyledNotificationTrigger = styled.span`
  cursor: pointer;
  display: flex;
  margin-right: 10px;
  line-height: 32px;
`

export default function UserNotification () {
  // const i18n = useI18n();
  const user = useSelector((state) => state.user)
  const [notifications, setNotifications] = useState([])
  const [notificationsList, setNotificationsList] = useState([])
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [panelOpened, setPanelOpened] = useState(false)
  const [panelClosed, setPanelClosed] = useState(true)
  const [visibleNotificationsCount, setVisibleNotificationsCount] = useState(0)
  const [clearingNotifications, setClearingNotifications] = useState(false)
  const isMountedRef = useRef(false)

  const history = useHistory()

  const NOTIFICATIONS_ENDPOINT = '/notifications'
  const NOTIFICATION_READ_ENDPOINT = '/notifications/read/'

  const triggerIconOffColor = '#888888'
  const triggerIconOnColor = '#ffffff'

  const [iconTriggerColor, setIconTriggerColor] = useState(triggerIconOffColor)

  const startTimeout = 0
  let endTimeout = 0
  let showTimeout = 0

  const closeItem = (id) => {
    notifications.forEach((item) => {
      if (item.id === id) {
        // eslint-disable-next-line no-console
        // console.log('>>> NOTIFICATIONS - CLOSING ITEM ID#', id);
        // eslint-disable-next-line no-param-reassign
        item.visible = false
      }
    })
    const updatedNotifications = notifications.filter((item) => item.id !== id)
    setNotifications(updatedNotifications)
    // eslint-disable-next-line no-console
    // console.log('>> THE NOTIFICATIONS', updatedNotifications);
    setVisibleNotificationsCount(
      updatedNotifications.filter((notification) => notification.visible).length
    )
    // eslint-disable-next-line no-console
    // console.log('>>> updated visible notify count = ', visibleNotificationsCount);
  }

  const startProgress = () => {
    // eslint-disable-next-line no-console
    // console.log('>>>> NOTIFICATIONS:: STARTING PROGRESS');
    if (isMountedRef.current) { setIsLoading(true) }
  }

  const endProgress = () => {
    // eslint-disable-next-line no-console
    // console.log('>>>> NOTIFICATIONS:: ENDING PROGRESS, Mounted VAL === ', isMountedRef.current);
    endTimeout = setTimeout(() => {
      if (isMountedRef.current) { setIsLoading(false) }
    }, 500)
  }

  const showNotifications = () => {
    setOpen(true)
    MP.track(NotificationEvents.CLICKED, {})
    showTimeout = setTimeout(() => {
      setPanelOpened(true)
      setPanelClosed(false)
    }, 1000)
  }

  const closeNotifications = () => {
    setVisibleNotificationsCount(
      notifications.filter((notification) => notification.visible).length
    )
    setOpen(false)
    setPanelOpened(false)
    // setTimeout(() => {
    setPanelClosed(true)
    // }, 3000);
  }

  const notificationsDisplayed = () => {
    setIconTriggerColor(triggerIconOnColor)
    // eslint-disable-next-line no-console
    // console.log('>>> NOTIFICATIONS OPENED');
  }

  const notificationsClosed = () => {
    setIconTriggerColor(triggerIconOffColor)
    // eslint-disable-next-line no-console
    // console.log('>>> NOTIFICATIONS CLOSED');
  }

  const addVisibilityIndicator = (notificationsData) => {
    return notificationsData.map((notification) => {
      // eslint-disable-next-line no-param-reassign
      notification.visible = true
      return notification
    })
  }

  const fetchUnreadNotifications = async () => {
    // console.log('>>> NOTIFY! FETCHING UNREAD NOTIFICATIONS...');
    // setIsLoading(true);
    startProgress()
    try {
      const unreadNotificationsResponse = await fetchData(NOTIFICATIONS_ENDPOINT)
      const unreadNotifications = addVisibilityIndicator(unreadNotificationsResponse.data)
      // eslint-disable-next-line no-console
      // console.log('>>> NOTIFY ---', unreadNotifications);
      // setNotifications(unreadNotifications);
      if (isMountedRef.current) {
        setVisibleNotificationsCount(unreadNotifications.length)
        setNotifications(unreadNotifications)
        endProgress()
      }
      // setIsLoading(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Unable to fetch user notifications')
      endProgress()
      // setIsLoading(false);
    }
  }

  // FIXME: Returns should be consistent on catch
  // eslint-disable-next-line consistent-return
  const readNotification = async (notification) => {
    startProgress()
    try {
      const readNotification = await postData(`${NOTIFICATION_READ_ENDPOINT}${notification.id}`, {
        isRead: true
      })
      endProgress()
      MP.track(NotificationEvents.READ_NOTIFICATION, { Notification: notification.id })
      return readNotification
      // if (!skipRedirect && notification.url !== '') {
      //   viewNotification();
      // }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Unable to read notification', e)
      endProgress()
    }
  }

  const clearNotifications = async () => {
    // startProgress();
    setClearingNotifications(true)
    const clearNotificationPromises = []
    notifications.forEach((notification) => {
      // eslint-disable-next-line no-param-reassign
      notification.visible = false
      clearNotificationPromises.push(readNotification(notification))
    })
    await Promise.all(clearNotificationPromises)
    MP.track(NotificationEvents.READ_ALL_NOTIFICATIONS, { 'Total Read': notifications.length })
    // eslint-disable-next-line no-console
    // console.log('>>> CLEARED ALL NOTIFICATIONS = ', clearAll);
    setVisibleNotificationsCount(0)
    setClearingNotifications(false)
    // setNotifications([]);
    // endProgress();
  }

  const handleViewNotificationRedirect = (url) => {
    setTimeout(() => {
      if (url !== '') {
        history.push(url)
      }
    }, 1500)
  }

  useEffect(() => {
    isMountedRef.current = true
    if (isMountedRef.current && user.status === SUCCEED) {
      fetchUnreadNotifications(isMountedRef.current)
    }

    return () => {
      isMountedRef.current = false
      clearTimeout(startTimeout)
      clearTimeout(endTimeout)
      clearTimeout(showTimeout)
    }
  // FIXME: I'm addding this to not break code, but we should add all missing dependencies here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (isMountedRef.current && user.status === SUCCEED) {
      const notificationItems = notifications.map((notification) => {
        return (
          <NotificationItem
            key={`ni_${notification.id}`}
            startProgress={startProgress}
            endProgress={endProgress}
            isLoading={isLoading}
            readNotification={readNotification}
            closeItem={closeItem}
            notification={notification}
            visible={notification.visible}
            notificationsCount={notifications.length}
            handleViewNotificationRedirect={handleViewNotificationRedirect}
          />
        )
      })
      setNotificationsList(notificationItems)
      // setVisibleNotificationsCount(unreadNotifications.length);
      // eslint-disable-next-line no-console
      // console.log('>>>> NOTIFICATION LIST ITEMS = ', notificationItems);
    }

    return () => {
      // isMounted = false;
      // isMountedRef.current = false;
    }
  // FIXME: I'm addding this to not break code, but we should add all missing dependencies here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMountedRef, notifications, isLoading, clearingNotifications, user])

  if (user.status !== SUCCEED) {
    return (null)
  }

  return (
    <StyledNotificationsWrapper>
      <StyledNotificationTrigger onClick={showNotifications}>
        <NotificationTriggerIcon
          visibleNotificationsCount={visibleNotificationsCount}
          notificationCount={notificationsList.length}
          width={20}
          height={20}
          fill={iconTriggerColor}
        />
      </StyledNotificationTrigger>
      <CSSTransition
        in={open}
        timeout={300}
        classNames='notification-panel'
        unmountOnExit
        onEnter={notificationsDisplayed}
        onExited={notificationsClosed}
      >
        <NotificationPanel
          key='notification-panel'
          startProgress={startProgress}
          endProgress={endProgress}
          panelOpened={panelOpened}
          panelClosed={panelClosed}
          isLoading={isLoading}
          clearNotifications={clearNotifications}
          visibleNotificationsCount={visibleNotificationsCount}
          notificationsCount={notificationsList.length}
          closeNotifications={closeNotifications}
          notificationsList={notificationsList}
        />
      </CSSTransition>
    </StyledNotificationsWrapper>
  )
}
