import loginPage from '../../support/pages/loginPage'
import resetPasswordPage from '../../support/pages/resetPasswordPage'

describe('Test Tombol Forgot Password dari halaman login', () => {
    it('1. Memastikan Tombol Forgot Password berfungsi', () => {
        cy.intercept('GET', '**/auth/requestPasswordResetCode').as('forgotPassword');

        loginPage.visit();
        loginPage.elements.forgotPasswordLink().click();

        cy.wait('@forgotPassword').then((intercept) => {
            const res = intercept.response;
            expect(res.statusCode).to.eq(200);
        })

        cy.url().should('include', '/auth/requestPasswordResetCode');
    });
});

describe('Reset Password Page Test', () => {
    let userDataTest;

    before(() => { cy.fixture('user').then((fdata) => { userDataTest =  fdata}); });
    beforeEach(() => { resetPasswordPage.visit() });

    it('1. Memastikan URL awal Reset Password sudah benar', () => {
        cy.url().should('include', '/auth/requestPasswordResetCode');
    });

    it('2. Memastikan Header text benar', () => {
        resetPasswordPage.elements.getHeaderText().should('contain', 'Reset Password');
    });

    it('3. Tes Tombol Cancel (balik ke halaman login)', () => {
        cy.intercept('GET', '**/auth/login').as('loginPage');

        resetPasswordPage.elements.getCancelBtn().click();
        cy.wait('@loginPage').then((intercept) => {
            const res = intercept.response;
            expect(res.statusCode).to.eq(200);
        })
        cy.url().should('include', '/auth/login');
    });

    it('4. Submit username kosong', () => {
        resetPasswordPage.elements.getResetBtn().click();
        cy.get('.oxd-input-group__message').should('contain', 'Required');
    });

    it('5. Submit Reset & Check Response', () => {
        cy.intercept('POST', '**/auth/requestResetPassword').as('resetReq');

        resetPasswordPage.submitReset(userDataTest.resetPassword.username);
        cy.wait('@resetReq').its('response.statusCode').should('be.oneOf', [200, 302]);
        resetPasswordPage.elements.getSuccessMessage().should('contain', 'Reset Password link sent');
    });
});