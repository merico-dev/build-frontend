context('Read a Notification', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/repositories')
  })

  it('shows notification trigger icon in navbar', () => {
    const triggerIcon = cy.get('header').get('div[class*="NotificationTrigger"]')
    triggerIcon.should('exist')
    triggerIcon.click()
  })

  it('user can read a notification', () => {
    const triggerIcon = cy.get('header').get('div[class*="NotificationTrigger"]')
    triggerIcon.should('exist')
    triggerIcon.click()
    const notificationPanel = cy.get('div[class*="NotificationPanel"]')
    notificationPanel.should('exist')
    const latestNotification = notificationPanel.get('div[class*="Notification"]:first')
    latestNotification.should('exist')
    const learnLink = latestNotification.get('span').contains('Learn more')
    learnLink.click()
    cy.url().should('include', '/badges/assertion');
  })

})