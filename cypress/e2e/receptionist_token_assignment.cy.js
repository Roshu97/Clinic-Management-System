describe('Receptionist Token Assignment', () => {
  beforeEach(() => {
    cy.loginWithEmailAndPassword('receptionist@clinicflow.com', 'password123');
    cy.visit('/receptionist/dashboard/index.html');
  });

  it('should register a new patient and add them to the queue', () => {
    // Navigate to Patient Registration tab
    cy.get('button[data-tab="registration"]').should('be.visible').click();
    cy.get('#panel-registration').should('not.have.class', 'hidden');

    // Fill out patient registration form
    cy.get('#pname').type('Test Patient');
    cy.get('#page').type('30');
    cy.get('#pgender').select('Male');
    cy.get('#pphone').type('123-456-7890');
    cy.get('#paddress').type('123 Test Street');
    cy.get('#pid').type('TP-001');

    // Register patient
    const stub = cy.stub();
      cy.on('window:alert', stub);

      // Register patient
      cy.get('#registerPatientBtn').click();
      cy.wait(500).then(() => {
        expect(stub.getCall(0)).to.be.calledWith('Patient registered (local).');
      });

      // Open the queue modal
      cy.get('#openQueueModal').click();
      cy.get('#modalPatientsTbody').should('be.visible');

      // Add the registered patient to the queue
      cy.get('#modalPatientsTbody').contains('tr', 'Test Patient').find('button[data-action="add-to-queue"]').click();
      cy.wait(500).then(() => {
        expect(stub.getCall(1)).to.be.calledWith(Cypress.sinon.match(/Added Test Patient to queue/));
      });

    // Verify patient is in the queue table
    cy.get('.queue-table tbody').contains('tr', 'Test Patient').should('be.visible');
  });
});