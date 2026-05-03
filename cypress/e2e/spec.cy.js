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

  it('Skenario Negatif: Gagal login (username salah & password benar)', () => {
    cy.get('input[name="username"]').type('admon');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('have.text', 'Invalid credentials');
  });

  it('Skenario Negatif: Gagal login (username benar & password salah)', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('have.text', 'Invalid credentials');
  });

  it('Skenario Negatif: Username tidak diisi', () => {
    cy.get('input[name="username"]').clear();
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();

    cy.contains('.oxd-input-group', 'Username')
      .find('.oxd-input-group__message')
      .should('be.visible')
      .and('have.text', 'Required');
  });

  it('Skenario Negatif: Password tidak diisi', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').clear();
    cy.get('button[type="submit"]').click();

    cy.contains('.oxd-input-group', 'Password')
      .find('.oxd-input-group__message')
      .should('be.visible')
      .and('have.text', 'Required');
  });

  it('Skenario Negatif: Username & Password tidak diisi', () => {
    cy.get('input[name="username"]').clear();
    cy.get('input[name="password"]').clear();
    cy.get('button[type="submit"]').click();

    cy.contains('.oxd-input-group', 'Username')
      .find('.oxd-input-group__message')
      .should('be.visible')
      .and('have.text', 'Required');

    cy.contains('.oxd-input-group', 'Password')
      .find('.oxd-input-group__message')
      .should('be.visible')
      .and('have.text', 'Required');

    cy.get('.oxd-input-group__message').should('have.length', 2);
  });
})

describe('OrangeHRM Login Feature Testing', () => {
  beforeEach(() => {
    cy.loginSession('Admin', 'admin123');
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    cy.intercept('GET', '**/dashboard/**').as('getDashboardData');
    cy.wait('@getDashboardData', { timeout: 15000 });
  });

  it('Skenario Positif: Berhasil logout', () => {
    cy.wait(1000);
    cy.get('.oxd-userdropdown-tab').click();
    cy.get('a[href*="logout"]').click();

    cy.url().should('include', '/auth/login');
    cy.get('button[type="submit"]')
      .should('be.visible')
      .and('contain', 'Login');
  });
})