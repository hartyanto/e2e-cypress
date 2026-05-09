class loginPage {
    elements = {
        usernameInput: () => cy.get('input[name="username"]'),
        passwordInput: () => cy.get('input[name="password"]'),
        loginBtn: () => cy.get('button[type="submit"]'),
        alertMessage: () => cy.get('.oxd-alert-content-text'),
        headerLogin: () => cy.get('.orangehrm-login-slot'),
        getRequiredMessage: () => cy.get('.oxd-input-group__message'),
        forgotPasswordLink: () => cy.get('.orangehrm-login-forgot-header')
    }

    visit() {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    }

    typeUsername(username) {
        this.elements.usernameInput().type(username);
    }

    typePassword(password) {
        this.elements.passwordInput().type(password);
    }

    clickLoginButton() {
        this.elements.loginBtn().click();
    }

    login(username, password) {
        if (username) this.typeUsername(username);
        if (password) this.typePassword(password);
        this.clickLoginButton();
    }

    verifyLoginFailed() {
        cy.url().should('include', '/auth/login');
        this.elements.usernameInput().should('be.visible');
        this.elements.passwordInput().should('be.visible');
        this.elements.headerLogin().should('contain', 'Login');
    }

    verifyLogoutSuccess() {
        cy.url().should('include', '/auth/login');
        this.elements.usernameInput().should('be.visible');
        this.elements.passwordInput().should('be.visible');
        this.elements.headerLogin().should('contain', 'Login');
    }

    verifyAlertMessage(expectedMessage) {
        this.elements.alertMessage()
            .should('be.visible')
            .and('contain.text', expectedMessage);
    }

    verifyInputErrorMessage(fieldLabel, expectedMessage) {
        cy.contains('.oxd-input-group', fieldLabel) // Cari container berdasarkan teks label
        .find('.oxd-input-group__message')       // Cari elemen pesan error di dalamnya
        .should('be.visible')
        .and('have.text', expectedMessage);
    }

    verifyPayloadLoginSuccess(payload) {
        cy.fixture('user').then((data) => {
            expect(payload).to.include(`username=${data.validUser.username.toLowerCase()}`);
            expect(payload).to.include(`password=${data.validUser.password}`);
        })
    }

    verifyResponseLoginSuccess(response) {
        const responseHeaders = response.headers;
        expect(response.statusCode).to.eq(302);
        expect(responseHeaders['location']).to.include('/dashboard/index');
        expect(responseHeaders).to.have.property('set-cookie');
        expect(responseHeaders['set-cookie'][0]).to.include('orangehrm=');
    }

    verifyResponseLoginFailed(response) {
        const responseHeaders = response.headers;
        expect(response.statusCode).to.eq(302);
        expect(responseHeaders['location']).to.include('/auth/login');
        expect(responseHeaders).not.to.have.property('set-cookie');
    }
}

export default new loginPage();