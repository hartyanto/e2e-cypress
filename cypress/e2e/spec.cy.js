describe('OrangeHRM Login Feature Testing', () => {
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });

  it('Skenario Positif: Berhasil login dengan username dan password yang benar', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard/index');
    cy.get('.oxd-topbar-header-breadcrumb-module')
      .should('be.visible')
      .and('have.text', 'Dashboard');
  });

  it('Skenario Negatif: Berhasil login dengan username salah namun password yang benar', () => {
    cy.get('input[name="username"]').type('admon');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('have.text', 'Invalid credentials');
  });

  it('Skenario Negatif: Berhasil login dengan username benar namun password yang salah', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('have.text', 'Invalid credentials');
  });
})