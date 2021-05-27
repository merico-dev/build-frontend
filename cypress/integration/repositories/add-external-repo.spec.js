context('Add External Repository (by URL)', () => {

  beforeEach(() => {
    cy.login()
    cy.visit('/repositories')
  })

  it('user can open browse repositories dialog', () => {
    cy.get('button').contains('Add New').click()
    cy.get('button').contains('Browse').should('exist')
    cy.get('button').contains('Browse').click()
    cy.get('div#alert-dialog-title').contains('Select Repositories to Process').should('exist')
    cy.get('button').contains('Back').should('exist')
    cy.get('button').contains('Confirm').should('exist')
  })

  it('allows user to add repository by external url', () => {
    cy.get('button').contains('Add New').click()
    cy.get('button').contains('Add URL').should('exist')
    cy.get('button').contains('Add URL').parent().should('have.attr', 'disabled')
    // @todo export this repo url to a fixture
    // @todo revise to support both Github and Gitlab workflow
    cy.get('input#RepositoryURL[type="text"]').type('https://github.com/snowpackjs/snowpack.git')
    cy.get('button').contains('Add URL').parent().should('not.have.attr', 'disabled')
    cy.get('button').contains('Add URL').click()
  })

  // @todo consider adding UNIT-level tests here for URL formatting
  it('allows user to enter http:// URL format', () => {
      const url = 'http://github.com/mericoqa2/special-octo-sniffle.git'
      cy.get('button').contains('Add New').click()
      cy.get('input#RepositoryURL[type="text"]').type(url)
      cy.get('button').contains('Add URL').click()
      cy.get('[data-test="external-repo-list"]').should('exist')
      cy.get('[data-test="external-repo-list-item"]').contains(url).should('exist')
  })

  it('allows user to enter https:// URL format', () => {
      const url = 'https://github.com/mericoqa2/special-octo-sniffle.git'
      cy.get('button').contains('Add New').click()
      cy.get('input#RepositoryURL[type="text"]').type(url)
      cy.get('button').contains('Add URL').click()
      cy.get('[data-test="external-repo-list"]').should('exist')
      cy.get('[data-test="external-repo-list-item"]').contains(url).should('exist')
  })

  it('allows user to enter git@ URL format', () => {
      const url = 'git@github.com:mericoqa2/special-octo-sniffle.git'
      cy.get('button').contains('Add New').click()
      cy.get('input#RepositoryURL[type="text"]').type(url)
      cy.get('button').contains('Add URL').click()
      cy.get('[data-test="external-repo-list"]').should('exist')
      cy.get('[data-test="external-repo-list-item"]').contains(url).should('exist')
  })

  it('prevents the same repository from being added to entry list', () => {
    const url = 'https://github.com/mericoqa2/special-octo-sniffle.git'
    cy.get('button').contains('Add New').click()
    cy.get('input#RepositoryURL[type="text"]').type(url)
    cy.get('button').contains('Add URL').click()
    cy.get('input#RepositoryURL[type="text"]').type(url)
    cy.get('button').contains('Add URL').parent().should('have.attr', 'disabled')
    cy.get('#RepositoryURL-helper-text').contains('Repository already added for processing.').should('exist')
  })

})
