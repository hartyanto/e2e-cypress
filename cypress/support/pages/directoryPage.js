class directoryPage {
    elements = {
        getTopbar: () => cy.get('.oxd-topbar-header-breadcrumb'),
        getSearchNameInput: () => cy.get('input[placeholder="Type for hints..."]'),
        getSearchBtn: () => cy.get('button[type="submit"]'),
        getResetBtn: () => cy.get('button[type="reset"]'),
        getEmployeeCards: () => cy.get('.orangehrm-directory-card'),
        getAutoCompleteDropdown: () => cy.get('.oxd-autocomplete-dropdown', { timeout: 10000 }),
        getAutoCompleteOption: (name) => this.elements.getAutoCompleteDropdown().contains('span', name),
        getJobTitleDropdown: () => cy.get('.oxd-select-text').eq(0),
        getDropdownOption: (text) => cy.get('.oxd-select-dropdown').contains('span', text),
        getLoader: () => cy.get('.orangehrm-container-loader'),
        getLocationDropdown: () => cy.get('.oxd-select-text').eq(1),
        getNoRecordMessage: () => cy.get('.orangehrm-paper-container'),
        getToastBottom: () => cy.get('.oxd-toast-container'),
        getHideFilterSection: () => cy.get('.oxd-table-filter-header-options'),
        getSidebarUserDetail: () => cy.get('.orangehrm-corporate-directory-sidebar'),
        getSidebarArrowRight: () => this.elements.getSidebarUserDetail().find('.bi-arrow-right')
    }

    visit() {
        cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/directory/viewDirectory');
    }

    searchEmployee(name) {
        this.elements.getSearchNameInput().type(name);
        cy.get('.oxd-autocomplete-option').should('be.visible').click();
        this.elements.getSearchBtn().click();
    }

    selectJobTitle(jobTitle) {
        this.elements.getJobTitleDropdown().click();
        this.elements.getDropdownOption(jobTitle).click();
    }

    selectLocation(location) {
        this.elements.getLocationDropdown().click();
        this.elements.getDropdownOption(location).click();
    }
}

export default new directoryPage();