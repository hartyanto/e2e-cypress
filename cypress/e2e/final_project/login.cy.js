import loginPage from '../../support/pages/loginPage'
import dashboardPage from '../../support/pages/dashboardPage'

describe('Login Page Test', () => {
    let userDataTest;

    before(() => { cy.fixture('user').then((fdata) => { userDataTest =  fdata}); });
    beforeEach(() => { loginPage.visit() });

    it('1. Memastikan URL awal Login sudah benar', () => {
        cy.url().should('include', '/auth/login');
    });

    it ('2. Login Sukses dengan username dan password yang valid | Cek Request & Response', () => {
        cy.intercept('POST', '**/auth/validate').as('validateLogin');
        cy.intercept('GET', '**/dashboard/**').as('getDashboardData');

        loginPage.login(userDataTest.validUser.username, userDataTest.validUser.password);

        cy.wait('@validateLogin').then((intercept) => {
            const payload = intercept.request.body;
            loginPage.verifyPayloadLoginSuccess(payload);
            loginPage.verifyResponseLoginSuccess(intercept.response);

            cy.wait('@getDashboardData').then((intercept) => {
                dashboardPage.verifyLoginSuccess();
            });
        });
    });

    it ('3. Login Gagal - Username salah', () => {
        cy.intercept('POST', '**/auth/validate').as('validateLogin');

        loginPage.login(userDataTest.invalidUsername.username, userDataTest.invalidUsername.password);

        cy.wait('@validateLogin').then((intercept) => {
            loginPage.verifyResponseLoginFailed(intercept.response);

            loginPage.verifyLoginFailed();
            loginPage.verifyAlertMessage('Invalid credentials');
        });
    });

    it ('4. Login Gagal - Password salah', () => {
        cy.intercept('POST', '**/auth/validate').as('validateLogin');

        loginPage.login(userDataTest.invalidPassword.username, userDataTest.invalidPassword.password);

        cy.wait('@validateLogin').then((intercept) => {
            loginPage.verifyResponseLoginFailed(intercept.response);

            loginPage.verifyLoginFailed();
            loginPage.verifyAlertMessage('Invalid credentials');
        });
    });

    it ('5. Login Gagal - Username kosong muncul required pada username', () => {
        loginPage.login('{backspace}', userDataTest.validUser.password);
        loginPage.verifyInputErrorMessage('Username', 'Required');
    });

    it ('6. Login Gagal - Password kosong muncul required pada password', () => {
        loginPage.login(userDataTest.validUser.username, '{backspace}');
        loginPage.verifyInputErrorMessage('Password', 'Required');
    });

    it ('7. Login Gagal - Form Kosong', () => {
        loginPage.login('{backspace}', '{backspace}');
        loginPage.verifyInputErrorMessage('Username', 'Required');
        loginPage.verifyInputErrorMessage('Password', 'Required');
        loginPage.elements.getRequiredMessage().should('have.length', 2);
    });

    it('8. Memastikan Placeholder Username dan Password sesuai', () => {
        loginPage.elements.usernameInput().should('have.attr', 'placeholder', 'Username');
        loginPage.elements.passwordInput().should('have.attr', 'placeholder', 'Password');
    });
})