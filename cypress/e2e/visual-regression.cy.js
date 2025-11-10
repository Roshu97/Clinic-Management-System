describe('Visual Regression Tests', () => {
  it('should compare homepage screenshot', () => {
    cy.visit('/');
    cy.compareSnapshot('homepage').then((results) => {
      console.log('Visual regression results:', results);
    });
  });
});