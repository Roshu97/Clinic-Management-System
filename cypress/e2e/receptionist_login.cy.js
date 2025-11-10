describe('Receptionist Login', () => {
  it('should display the receptionist login form', () => {
    cy.visit('/login/receptionist/index.html');
    cy.title().should('contain', 'Receptionist Portal - Login');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Login');
  });
});