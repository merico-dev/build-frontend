context('List Repositories', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/repositories')
  })

  it('lists the projects table (repositories) for the user', () => {
    cy.get('th[scope="col"]').contains('Repository').should('exist')
    cy.get('th[scope="col"]').contains('Last Processed Commit').should('exist')
    cy.get('th[scope="col"]').contains('Status').should('exist')
  })

  it('allows user to add / delete repository', () => {
    cy.get('button').contains('Add New').should('exist')
    cy.get('button').contains('Delete').should('exist')
  })

  it('user can open add repositories dialog', () => {
    cy.get('button').contains('Add New').click()
    cy.get('div[role="dialog"]').should('exist')
    cy.get('div#alert-dialog-title').contains('Add New Repositories').should('exist')
  })

  it('user can open browse repositories dialog', () => {
    cy.get('button').contains('Add New').click()
    cy.get('button').contains('Browse').should('exist')
    cy.get('button').contains('Browse').click()
    cy.get('div#alert-dialog-title').contains('Select Repositories to Process').should('exist')
    cy.get('button').contains('Back').should('exist')
    cy.get('button').contains('Confirm').should('exist')
  })

  it('allows user to add by external url', () => {
    cy.get('button').contains('Add New').click()
    cy.get('button').contains('Add URL').should('exist')
  })

  it('has/displays action icons for a repository', () => {
    cy.get('table > tbody > tr:first > td:last').find('div[title="View Public Project Profile"]').should('have.length', 1)
    cy.get('table > tbody > tr:first > td:last').find('div[title="View Public Project Profile"]').should('have.length', 1)
    cy.get('table > tbody > tr:first > td:last').find('div[title="Re-run Analysis"]').should('have.length', 1)
    cy.get('table > tbody > tr:first > td:last').find('div[title="Delete"]').should('have.length', 1)
    cy.get('table > tbody > tr:first > td:last').get('span[data-test="check-repository"]').should('exist')
  })

})
