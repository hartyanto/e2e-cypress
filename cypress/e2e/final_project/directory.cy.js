import loginPage from '../../support/pages/loginPage';
import dashboardPage from '../../support/pages/dashboardPage';
import directoryPage from '../../support/pages/directoryPage';

describe('Directory Page Test', () => {
    let userDataTest;

    before(() => { cy.fixture('user').then((fdata) => { userDataTest =  fdata}); });
    beforeEach(() => {
        cy.session('loginSession', () => {
            loginPage.visit();
            loginPage.login(userDataTest.validUser.username, userDataTest.validUser.password);
            cy.url().should('include', '/dashboard');
        });

        directoryPage.visit();
    });

    it('1. Memastikan URL awal Directory sudah benar', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.reload();
        cy.wait('@getEmployees').its('response.statusCode').should('eq', 200);
        cy.url().should('include', '/directory/viewDirectory');
    });

    it('2. Validasi teks Header Halaman & Button Muncul', () => {
        directoryPage.elements.getTopbar().should('contain', 'Directory');
        directoryPage.elements.getSearchBtn().should('be.visible').and('not.be.disabled');
        directoryPage.elements.getResetBtn().should('be.visible').and('not.be.disabled');
    });

    it('3. Cari Karyawan Berdasarkan Nama (Valid)', () => {
        cy.intercept('GET', `**/api/v2/directory/employees?nameOrId=${userDataTest.directorySearch.validHint}**`).as('autoComplete');
        directoryPage.elements.getSearchNameInput().type(userDataTest.directorySearch.validHint);

        cy.wait('@autoComplete').its('response.statusCode').should('eq', 200);

        directoryPage.elements.getAutoCompleteOption(userDataTest.directorySearch.validFullName).click();
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getEmployeeCards().should('have.length', 1);
        directoryPage.elements.getEmployeeCards().first().should('contain', userDataTest.directorySearch.validFullName);
    });

    it('4. Pencarian berdasarkan Job Title saja', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        cy.intercept('GET', '**/api/v2/directory/employees**').as('searchJob');
        directoryPage.selectJobTitle(userDataTest.directorySearch.validJobTitle);
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getLoader().should('be.visible');
        cy.wait('@searchJob').then((res) => {
            directoryPage.elements.getLoader().should('not.exist');
            directoryPage.elements.getEmployeeCards().each(($el) => {
                cy.wrap($el).should('contain', userDataTest.directorySearch.validJobTitle);
            });
        });
    });

    it('5. Pencarian berdasarkan Location saja', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        cy.intercept('GET', '**/api/v2/directory/employees**').as('searchLocation');
        directoryPage.selectLocation(userDataTest.directorySearch.validLocation);
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getLoader().should('be.visible');
        cy.wait('@searchLocation').then((res) => {
            directoryPage.elements.getLoader().should('not.exist');
            directoryPage.elements.getEmployeeCards().each(($el) => {
                cy.wrap($el).should('contain', userDataTest.directorySearch.validLocation);
            });
        });
    });
});