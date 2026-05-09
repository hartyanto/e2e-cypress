class resetPasswordPage {
    elements = {
        getHeaderText: () => cy.get('.orangehrm-forgot-password-title'),
        getUsernameInput: () => cy.get('input[name="username"]'),
        getResetBtn: () => cy.get('button[type="submit"]'),
        getCancelBtn: () => cy.get('button[type="button"]'),
        getSuccessMessage: () => cy.get('.oxd-text--h6')
    }

    visit() {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode');
    }

    submitReset(username) {
        if (username) this.elements.getUsernameInput().type(username);
        this.elements.getResetBtn().click();
    }
}

export default new resetPasswordPage();