context('Contributor Public Profile', () => {

  beforeEach(function () {
    cy.login()
    cy.fixture('contributor-profile').then((data) => {
      this.profile = { statusCode: 200, body: { data: data.profile }}
      this.repositories = { statusCode: 200, body: { data: data.repositories }}
      this.progress = { statusCode: 200, body: { data: data.progress }}
    })
  })

  context('Native Contributor (Merico Registered User)', () => {
    beforeEach(function () {     
      cy.visit('/contributor/profile?email=MericoE2E%40merico.gonze.com&startDate=1921-05-03T00:00:00.000-04:00&endDate=2021-05-03T23:59:59.999-04:00')
      cy.intercept('/contributors/profile?email=*', this.profile)
      cy.intercept('/contributors/top-repositories?email=*', this.repositories)
      cy.intercept('/contributors/progress?email=*', this.progress)
    })

    it('shows contributor profile information', function () {
      cy.get('[data-test=contributor-profile-details]').should('be.visible')
      cy.get('[data-test=contributor-profile-name]').should('be.visible')
      cy.get('[data-test=contributor-profile-avatar]').should('be.visible')
      cy.get('[data-test=contributor-profile-url]').should('be.visible')
    })

    it('shows contributor top languages', function () {
      cy.get('[data-test=contributor-profile-languages]').should('be.visible')
      .get('[data-test=top-achievement-item]')
      .should('not.have.length', 0)
      .its('length')
      .should('be.gte', 1)    
    })

    it('shows contributor badge highlights', function () {
      cy.get('[data-test=contributor-profile-badges]').should('be.visible')
      .get('[data-test=badge-assertion]')
      .should('not.have.length', 0)
      .its('length')
      .should('be.gte', 1)
    })

    it('shows top repositories data grid', function () {
      cy.contains('h1', 'Top Repositories').should('be.visible')
      cy.get('[data-test=contributor-profile-repositories-grid]').should('be.visible')
      cy.get('[data-field=rank]',).should('be.visible')
      cy.get('[data-field=repository]',).should('be.visible')
      cy.get('[data-field=eloc]',).should('be.visible')
      cy.get('[data-field=impact]',).should('be.visible')
      cy.get('[data-field=merges]',).should('be.visible')            
    })

    it('shows progress: repository selector', function () {
      cy.get('[data-test=contributor-profile-progress]')
      .get('[data-test=filter-select]').should('be.visible')
    })

    it('shows progress: date selector', function () {
      cy.get('[data-test=date-input-selector]').should('be.visible')
    })

    it('shows progress: total eloc graph', function () {
      cy.get('[data-test=contributor-profile-progress-total-eloc]').should('be.visible')
    })

    it('shows progress: incremental eloc graph', function () {
      cy.get('[data-test=contributor-profile-progress-incremental-eloc]').should('be.visible')
    })

    it('shows progress: impact graph', function () {
      cy.get('[data-test=contributor-profile-impact]').should('be.visible')
    })

    it('shows merges progress: graph', function () {
      cy.get('[data-test=contributor-profile-merges-grid]').should('be.visible')
    })

    it('shows latest commits data grid', function () {
      cy.contains('h2', 'Latest Commits').should('be.visible')
      cy.get('[data-test=contributor-profile-commits-grid]').should('be.visible')
      cy.get('[data-test=contributor-profile-commits-grid]').get('[data-field=time]').should('be.visible')     
      cy.get('[data-test=contributor-profile-commits-grid]').get('[data-field=message]').should('be.visible') 
      cy.get('[data-test=contributor-profile-commits-grid]').get('[data-field=eloc]').should('be.visible') 
      cy.get('[data-test=contributor-profile-commits-grid]').get('[data-field=impact]').should('be.visible')   
    })

    it('shows all contributor badges', function () {
      cy.get('[data-test=contributor-profile-badges-list]').should('be.visible')
      .get('[data-test=badge-assertion]')
      .should('not.have.length', 0)
      .its('length')
      .should('be.gte', 1)
    })
  })

  context('External/Non-Native Contributor (NO Merico Account)', () => {
    beforeEach(function () {   
      this.profile.body.data.userId = null
      this.profile.body.data.displayName = 'External Contributor'
      this.profile.body.data.email = 'external-contributor@merico.gonze.com'
      cy.visit('/contributor/profile?email=external-contributor%40merico.gonze.com')
      cy.intercept('/contributors/profile?email=*', this.profile)
      cy.intercept('/contributors/top-repositories?email=*', this.repositories)
      cy.intercept('/contributors/progress?email=*', this.progress)
    })

    it('shows contributor invitation button', function () {
      cy.get('[data-test=contributor-invitation-button]').should('be.visible')
    })

    it('hides contributor top languages', function () {
      cy.get('[data-test=contributor-profile-languages]').should('not.exist')
    })

    it('hides contributor badge highlights', function () {
      cy.get('[data-test=contributor-profile-badges]').should('not.exist')
    })

    it('hides all contributor badges', function () {
      cy.get('[data-test=contributor-profile-badges-list]').should('not.exist')
    })    
  })

  context('Missing/Invalid Contributor (NO Merico Account or Contributor Metrics)', () => {
    beforeEach(function () {     
      cy.visit('/contributor/profile?email=contributor-does-not-exist%40merico.dev')
      cy.intercept('/contributors/profile?email=*').as('contributor404')
      cy.wait('@contributor404').its('response.body')
        .should('have.property', 'error')
        .should('have.property', 'message')
        .should('include', 'No user or contributor found for email')
    })
    it('shows contributor not found message', function () {
      cy.get('[data-test=contributor-profile-404-heading-not-available')
        .should('be.visible')
        .contains('Contributor Unavailable')
      cy.get('[data-test=contributor-profile-404-message-not-available').should('be.visible')
      cy.get('[data-test=contributor-profile-404-continue-button').should('be.visible')
    })
  })
  
})

context('Contributor Public Profile (Logged out)', () => {
  beforeEach(() => {
    cy.visit('/contributor/profile?email=MericoE2E%40merico.gonze.com&startDate=1921-05-03T00:00:00.000-04:00&endDate=2021-05-03T23:59:59.999-04:00')
  })
  context('Profile Info', () => {
    it('shows contributor profile information', function () {
      cy.get('[data-test=contributor-profile-details]').should('be.visible')
      cy.get('[data-test=contributor-profile-name]').should('be.visible')
      cy.get('[data-test=contributor-profile-avatar]').should('be.visible')
      cy.get('[data-test=contributor-profile-url]').should('be.visible')
    })
  })
  context('Header', () => {
    it('shows correct links and buttons', () => {
      cy.get('[data-test=topbar-link-about]').should('be.visible')
      cy.get('[data-test=topbar-link-contact]').should('be.visible')
      cy.get('[data-test=topbar-link-help]').should('be.visible')
      cy.get('[data-test=topbar-link-github]').should('be.visible')
      cy.get('[data-test=topbar-button-signup]').should('be.visible')
    })
  })
})

