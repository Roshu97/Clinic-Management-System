describe('Doctor Login', () => {
  it('should display the doctor login form', () => {
    cy.visit('/login/doctor/index.html');
    cy.title().should('contain', 'Doctor Portal - Login');
    cy.get('#email').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Login');
  });
});