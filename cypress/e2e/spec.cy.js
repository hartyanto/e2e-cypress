describe('OrangeHRM Login Feature Testing', () => {
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.fixture('user').as('userData');
  });

  it('Skenario Positif: Berhasil login dengan username dan password yang benar', function() {
    cy.get('input[name="username"]').type(this.userData.validUser.username);
    cy.get('input[name="password"]').type(this.userData.validUser.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard/index');
    cy.get('.oxd-topbar-header-breadcrumb-module')
      .should('be.visible')
      .and('have.text', 'Dashboard');
  });

  it('Skenario Negatif: Gagal login (username salah & password benar)', function() {
    cy.get('input[name="username"]').type(this.userData.invalidPassword.username);
    cy.get('input[name="password"]').type(this.userData.invalidPassword.password);
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('have.text', 'Invalid credentials');
  });

  it('Skenario Negatif: Gagal login (username benar & password salah)', function() {
    cy.get('input[name="username"]').type(this.userData.invalidUsername.username);
    cy.get('input[name="password"]').type(this.userData.invalidUsername.password);
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('have.text', 'Invalid credentials');
  });

  it('Skenario Negatif: Password salah (case sensitive)', function() {
    cy.get('input[name="username"]').type(this.userData.passwordCaseSensitive.username);
    cy.get('input[name="password"]').type(this.userData.passwordCaseSensitive.password);
    cy.get('button[type="submit"]').click();

    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('have.text', 'Invalid credentials');
  });

  it('Skenario Negatif: Username tidak diisi', function() {
    cy.get('input[name="username"]').clear();
    cy.get('input[name="password"]').type(this.userData.validUser.password);
    cy.get('button[type="submit"]').click();

    cy.contains('.oxd-input-group', 'Username')
      .find('.oxd-input-group__message')
      .should('be.visible')
      .and('have.text', 'Required');
  });

  it('Skenario Negatif: Password tidak diisi', function() {
    cy.get('input[name="username"]').type(this.userData.validUser.username);
    cy.get('input[name="password"]').clear();
    cy.get('button[type="submit"]').click();

    cy.contains('.oxd-input-group', 'Password')
      .find('.oxd-input-group__message')
      .should('be.visible')
      .and('have.text', 'Required');
  });

  it('Skenario Negatif: Username & Password tidak diisi', function() {
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
    cy.fixture('user').then((user) => {
      cy.loginSession(user.validUser.username, user.validUser.password);
    })
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

describe('Access Control Testing', () => {
  it('Skenario Negatif: Mengakses Dashboard tanpa Login (Direct URL)', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index', { failOnStatusCode: false });
    cy.url().should('include', '/auth/login');
    cy.get('.oxd-topbar-header-breadcrumb-module').should('not.exist');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('.orangehrm-login-slot').should('contain', 'Login');
  });
});