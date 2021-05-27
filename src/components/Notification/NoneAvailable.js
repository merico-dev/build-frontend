import React from 'react'

export default function NoneAvailable (props) {
  const { isLoading, getVisibleNotificationsCount } = props

  if (!isLoading && getVisibleNotificationsCount() === 0) {
    return (
      <p style={{ padding: '0 12px' }}>You have <strong>0 unread</strong> notifications to display.</p>
    )
  }
  return (null)
}
