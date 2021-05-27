context('Delete Account', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/account/settings')
  })

  it('User can visit Account Page', () => {
    cy.visit('/account/settings')
    cy.url().should('include', '/account/settings');
  })

  it('User Has Delete Account Button', () => {
    cy.get('button').contains('Delete Account').should('exist')
  })

  it('Application Shows Delete Account Confirmation Dialog', () => {
    cy.get('button').contains('Delete Account').click()
    cy.get('div[role="dialog"]').should('exist')
    cy.get('div#alert-dialog-title').contains('Are you sure about deleting your account?')
    cy.get('button').contains('Cancel').should('exist')
    cy.get('button').contains('Delete My Account').should('exist')
  })

  it('Dialog Allows user to Cancel', () => {
    cy.get('button').contains('Delete Account').click()
    cy.get('button').contains('Cancel').click()
    cy.get('div[role="dialog"]', { timeout: 10000 }).should('not.exist')
  })

  it('Dialog Allows user to Confirm Account Deletion', () => {
    cy.get('button').contains('Delete Account').click()
    cy.get('div[role="dialog"]').should('exist')
    cy.get('div#alert-dialog-title').contains('Are you sure about deleting your account?')    
    cy.get('button').contains('Delete My Account')
  })

  // DELETE ACCOUNT CONFIRM
  // This will actually delete the user account, not recommended for each run.
  // 
  // it('Application Redirects User to Deleted Confirmation Page (IF CONFIRMED)', () => {
  //   cy.get('button').contains('Delete Account').click()
  //   cy.get('button').contains('Delete My Account').click()
  //   cy.url().should('include', '/account/deleted')
  //   cy.contains('Your account has been successfully deleted.')
  //   cy.get('button').contains('Go Back to Home')
  //   cy.getCookie('ce-backend-jwt').should('not.exist')
  // })

})