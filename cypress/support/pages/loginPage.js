class loginPage {
    elements = {
        usernameInput: () => cy.get('input[name="username"]'),
        passwordInput: () => cy.get('input[name="password"]'),
        loginBtn: () => cy.get('button[type="submit"]'),
        alertMessage: () => cy.get('.oxd-alert-content-text'),
        headerLogin: () => cy.get('.orangehrm-login-slot')
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

    verifyLoginSuccess() {
        cy.url().should('include', '/dashboard/index');
        this.elements.dashboardHeader()
            .should('be.visible')
            .should('have.text', 'Dashboard');
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
}

export default new loginPage();