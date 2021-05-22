import React from 'react'
import styled from '@emotion/styled'

const StyledNotificationTriggerIcon = styled.div`

  position: relative;

  &.has-notifications {
    &:after {
      display: inline-block;
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #ED6A45;
      color: #ED6A45;
      right: 1px;
      top: 4px;
      border: 0;
      z-index: 50;
      content: '\u2219';
      font-size: 5px;
    }

    svg {
      fill: #eeeeee;
    }
  }

`

export default function NotificationTriggerIcon (props) {
  const { width, height, notificationCount, visibleNotificationsCount } = props
  let { fill } = props
  let cssClasses = ''

  if (notificationCount > 0 && visibleNotificationsCount > 0) {
    cssClasses = 'has-notifications'
    fill = '#aaaaaa'
  }

  return (
    <StyledNotificationTriggerIcon className={cssClasses}>
      <svg width={width} height={height} viewBox='0 0 16 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <path
          // eslint-disable-next-line max-len
          d='M15.125 17H14.5625V9.03125C14.5625 5.72422 12.118 2.98906 8.9375 2.53438V1.625C8.9375 1.10703 8.51797 0.6875 8 0.6875C7.48203 0.6875 7.0625 1.10703 7.0625 1.625V2.53438C3.88203 2.98906 1.4375 5.72422 1.4375 9.03125V17H0.875C0.460156 17 0.125 17.3352 0.125 17.75V18.5C0.125 18.6031 0.209375 18.6875 0.3125 18.6875H5.375C5.375 20.1359 6.55156 21.3125 8 21.3125C9.44844 21.3125 10.625 20.1359 10.625 18.6875H15.6875C15.7906 18.6875 15.875 18.6031 15.875 18.5V17.75C15.875 17.3352 15.5398 17 15.125 17ZM8 19.8125C7.37891 19.8125 6.875 19.3086 6.875 18.6875H9.125C9.125 19.3086 8.62109 19.8125 8 19.8125Z'
          fill={fill}
        />
      </svg>
    </StyledNotificationTriggerIcon>
  )
}
