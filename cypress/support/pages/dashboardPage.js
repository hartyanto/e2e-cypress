class dashboardPage {
    elements = {
        dashboardHeader: () => cy.get('.oxd-topbar-header-breadcrumb-module'),
        userDropdown: () => cy.get('.oxd-userdropdown-tab'),
        logoutButton: () => cy.get('a[href*="logout"]'),
    }

    visit() {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index', { failOnStatusCode: false });
    }

    logout() {
        cy.wait(1000);
        this.elements.userDropdown().click();
        this.elements.logoutButton().click();
    }

    verifyLoginSuccess() {
        cy.url().should('include', '/dashboard/index');
        this.elements.dashboardHeader()
            .should('be.visible')
            .should('have.text', 'Dashboard');
    }
}

export default new dashboardPage();