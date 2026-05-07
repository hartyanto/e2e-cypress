import loginPage from '../../support/pages/loginPage';
import dashboardPage from '../../support/pages/dashboardPage';

describe('OrangeHRM Login Feature Testing', () => {
  beforeEach(() => {
    loginPage.visit();
    cy.fixture('user').as('userData');
  });

  it('Skenario Positif: Berhasil login dengan username dan password yang benar', function() {
    loginPage.typeUsername(this.userData.validUser.username);
    loginPage.typePassword(this.userData.validUser.password);
    loginPage.clickLoginButton()

    dashboardPage.verifyLoginSuccess();
  });

  it('Skenario Negatif: Gagal login (username salah & password benar)', function() {
    loginPage.typeUsername(this.userData.invalidPassword.username);
    loginPage.typePassword(this.userData.invalidPassword.password);
    loginPage.clickLoginButton()

    loginPage.verifyAlertMessage('Invalid credentials');
  });

  it('Skenario Negatif: Gagal login (username benar & password salah)', function() {
    loginPage.login(this.userData.invalidUsername.username, this.userData.invalidUsername.password);

    loginPage.verifyAlertMessage('Invalid credentials');
  });

  it('Skenario Negatif: Password salah (case sensitive)', function() {
    loginPage.login(this.userData.passwordCaseSensitive.username, this.userData.passwordCaseSensitive.password);

    loginPage.verifyAlertMessage('Invalid credentials');
  });

  it('Skenario Negatif: Username tidak diisi', function() {
    loginPage.login('{backspace}', this.userData.validUser.password);

    loginPage.verifyInputErrorMessage('Username', 'Required');
  });

  it('Skenario Negatif: Password tidak diisi', function() {
    loginPage.login(this.userData.validUser.username, '{backspace}');

    loginPage.verifyInputErrorMessage('Password', 'Required');
  });

  it('Skenario Negatif: Username & Password tidak diisi', function() {
    loginPage.login('{backspace}', '{backspace}');

    loginPage.verifyInputErrorMessage('Username', 'Required');
    loginPage.verifyInputErrorMessage('Password', 'Required');
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
    dashboardPage.logout();
    loginPage.verifyLogoutSuccess();
  });
})

describe('Access Control Testing', () => {
  it('Skenario Negatif: Mengakses Dashboard tanpa Login (Direct URL)', () => {
    dashboardPage.visit();

    loginPage.verifyLoginFailed()
    dashboardPage.elements.dashboardHeader().should('not.exist');
  });
});