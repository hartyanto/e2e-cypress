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
        cy.intercept('GET', `**/api/v2/directory/employees?nameOrId=${userDataTest.directorySearch.validUser.hint}**`).as('autoComplete');
        directoryPage.elements.getSearchNameInput().type(userDataTest.directorySearch.validUser.hint);

        cy.wait('@autoComplete').its('response.statusCode').should('eq', 200);

        directoryPage.elements.getAutoCompleteOption(userDataTest.directorySearch.validUser.fullName).click();
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getEmployeeCards().should('have.length', 1);
        directoryPage.elements.getEmployeeCards().first().should('contain', userDataTest.directorySearch.validUser.fullName);
    });

    it('4. Pencarian berdasarkan Job Title saja', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        cy.intercept('GET', '**/api/v2/directory/employees**').as('searchJob');
        directoryPage.selectJobTitle(userDataTest.directorySearch.validUser.jobTitle);
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getLoader().should('be.visible');
        cy.wait('@searchJob').then((res) => {
            directoryPage.elements.getLoader().should('not.exist');
            directoryPage.elements.getEmployeeCards().each(($el) => {
                cy.wrap($el).should('contain', userDataTest.directorySearch.validUser.jobTitle);
            });
        });
    });

    it('5. Pencarian berdasarkan Location saja', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        cy.intercept('GET', '**/api/v2/directory/employees**').as('searchLocation');
        directoryPage.selectLocation(userDataTest.directorySearch.validUser.location);
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getLoader().should('be.visible');
        cy.wait('@searchLocation').then((res) => {
            directoryPage.elements.getLoader().should('not.exist');
            directoryPage.elements.getEmployeeCards().each(($el) => {
                cy.wrap($el).should('contain', userDataTest.directorySearch.validUser.location);
            });
        });
    });

    it('6. Cari Karyawan Berdasarkan Nama & Job Title (Valid)', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        cy.intercept('GET', `**/api/v2/directory/employees?nameOrId=${userDataTest.directorySearch.validUser.hint}**`).as('autoComplete');
        directoryPage.elements.getSearchNameInput().type(userDataTest.directorySearch.validUser.hint);
        cy.wait('@autoComplete').its('response.statusCode').should('eq', 200);
        directoryPage.elements.getAutoCompleteOption(userDataTest.directorySearch.validUser.fullName).click();
    
        directoryPage.selectJobTitle(userDataTest.directorySearch.validUser.jobTitle);
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getEmployeeCards().should('have.length', 1);
        directoryPage.elements.getEmployeeCards().first().should('contain', userDataTest.directorySearch.validUser.fullName);
        directoryPage.elements.getEmployeeCards().first().should('contain', userDataTest.directorySearch.validUser.jobTitle);
    });

    it('7. Cari Karyawan Berdasarkan Nama & Job Title (User not found)', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        cy.intercept('GET', `**/api/v2/directory/employees?nameOrId=${userDataTest.directorySearch.validUser.hint}**`).as('autoComplete');
        directoryPage.elements.getSearchNameInput().type(userDataTest.directorySearch.validUser.hint);
        cy.wait('@autoComplete').its('response.statusCode').should('eq', 200);
        directoryPage.elements.getAutoCompleteOption(userDataTest.directorySearch.validUser.fullName).click();

        directoryPage.selectJobTitle(userDataTest.directorySearch.jobTitle);
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getToastBottom().should('be.visible');
        directoryPage.elements.getNoRecordMessage().should('contain', 'No Records Found');
        directoryPage.elements.getToastBottom().should('contain', 'No Records Found');
    });

    it('8. Fungsi Reset Button', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        cy.intercept('GET', `**/api/v2/directory/employees?nameOrId=${userDataTest.directorySearch.validUser.hint}**`).as('autoComplete');
        directoryPage.elements.getSearchNameInput().type(userDataTest.directorySearch.validUser.hint);
        cy.wait('@autoComplete').its('response.statusCode').should('eq', 200);
        directoryPage.elements.getAutoCompleteOption(userDataTest.directorySearch.validUser.fullName).click();
        
        directoryPage.selectJobTitle(userDataTest.directorySearch.validUser.jobTitle);
        directoryPage.selectLocation(userDataTest.directorySearch.validUser.location);
        directoryPage.elements.getResetBtn().click();

        directoryPage.elements.getSearchNameInput().should('be.empty');
        directoryPage.elements.getJobTitleDropdown().should('contain', '-- Select --');
        directoryPage.elements.getLocationDropdown().should('contain', '-- Select --');
    });

    it('9. Fungsi Hide Filter Section', () => {
        directoryPage.elements.getHideFilterSection().click();

        directoryPage.elements.getSearchBtn().should('not.be.visible');
        directoryPage.elements.getResetBtn().should('not.be.visible');
        directoryPage.elements.getSearchNameInput().should('not.be.visible');
        directoryPage.elements.getJobTitleDropdown().should('not.be.visible');
        directoryPage.elements.getLocationDropdown().should('not.be.visible');
    });

    it('10. Pencarian berdasarkan Job Title saja - Mock API', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        cy.intercept('GET', '**/api/v2/directory/employees?limit=**', {
            statusCode: 200,
            body: {
                data: [
                    {
                        "empNumber": 9999,
                        "lastName": "",
                        "firstName": userDataTest.directorySearch.validUser.fullName,
                        "middleName": "",
                        "terminationId": null,
                        "jobTitle": {
                            "id": 23,
                            "title": userDataTest.directorySearch.validUser.jobTitle,
                            "isDeleted": false
                        },
                        "subunit": {
                            "id": 13,
                            "name": "Human Resources"
                        },
                        "location": {
                            "id": 5,
                            "name": userDataTest.directorySearch.validUser.location,
                        }
                    }
                ],
                "meta": {
                    "total": 1
                },
                "rels": []
            }
        }).as('mockSearchJobResult');

        directoryPage.selectJobTitle(userDataTest.directorySearch.validUser.jobTitle);
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getLoader().should('be.visible');
        cy.wait('@mockSearchJobResult').then((res) => {
            directoryPage.elements.getLoader().should('not.exist');
            directoryPage.elements.getEmployeeCards().each(($el) => {
                cy.wrap($el).should('contain', userDataTest.directorySearch.validUser.jobTitle);
            });
        });
    });

    it('11. Pencarian berdasarkan Location saja - Mock API', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        cy.intercept('GET', '**/api/v2/directory/employees?limit=**', {
            statusCode: 200,
            body: {
                data: [
                    {
                        "empNumber": 9999,
                        "lastName": "",
                        "firstName": userDataTest.directorySearch.validUser.fullName,
                        "middleName": "",
                        "terminationId": null,
                        "jobTitle": {
                            "id": 23,
                            "title": userDataTest.directorySearch.validUser.jobTitle,
                            "isDeleted": false
                        },
                        "subunit": {
                            "id": 13,
                            "name": "Human Resources"
                        },
                        "location": {
                            "id": 5,
                            "name": userDataTest.directorySearch.validUser.location,
                        }
                    }
                ],
                "meta": {
                    "total": 1
                },
                "rels": []
            }
        }).as('mockSearchLocationResult');
        directoryPage.selectLocation(userDataTest.directorySearch.validUser.location);
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getLoader().should('be.visible');
        cy.wait('@mockSearchLocationResult').then((res) => {
            directoryPage.elements.getLoader().should('not.exist');
            directoryPage.elements.getEmployeeCards().each(($el) => {
                cy.wrap($el).should('contain', userDataTest.directorySearch.validUser.location);
            });
        });
    });

    it('12. Cari Karyawan Berdasarkan Nama & Job Title (Valid) - Mock API', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        cy.intercept('GET', `**/api/v2/directory/employees?nameOrId=${userDataTest.directorySearch.validUser.hint}**`, {
        statusCode: 200,
        body: {
            data: [
                {
                    "empNumber": 9999,
                    "lastName": "",
                    "firstName": userDataTest.directorySearch.validUser.fullName,
                    "middleName": "",
                    "terminationId": null,
                    "jobTitle": {
                        "id": 23,
                        "title": userDataTest.directorySearch.validUser.jobTitle,
                        "isDeleted": false
                    },
                    "subunit": {
                        "id": 13,
                        "name": "Human Resources"
                    },
                    "location": {
                        "id": 5,
                        "name": userDataTest.directorySearch.validUser.location,
                    }
                }
            ]}
        }).as('mockAutoComplete');

        cy.intercept('GET', '**/api/v2/directory/employees?limit=**', {
            statusCode: 200,
            body: {
                data: [
                    {
                        "empNumber": 9999,
                        "lastName": "",
                        "firstName": userDataTest.directorySearch.validUser.fullName,
                        "middleName": "",
                        "terminationId": null,
                        "jobTitle": {
                            "id": 23,
                            "title": userDataTest.directorySearch.validUser.jobTitle,
                            "isDeleted": false
                        },
                        "subunit": {
                            "id": 13,
                            "name": "Human Resources"
                        },
                        "location": {
                            "id": 5,
                            "name": userDataTest.directorySearch.validUser.location,
                        }
                    }
                ],
                "meta": {
                    "total": 1
                },
                "rels": []
            }
        }).as('mockSearchResult');

        directoryPage.elements.getSearchNameInput().type(userDataTest.directorySearch.validUser.hint);
        cy.wait('@mockAutoComplete').its('response.statusCode').should('eq', 200);
        directoryPage.elements.getAutoCompleteOption(userDataTest.directorySearch.validUser.fullName).click();

        directoryPage.selectJobTitle(userDataTest.directorySearch.validUser.jobTitle);
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getEmployeeCards().should('have.length', 1);
        directoryPage.elements.getEmployeeCards().first().should('contain', userDataTest.directorySearch.validUser.fullName);
        directoryPage.elements.getEmployeeCards().first().should('contain', userDataTest.directorySearch.validUser.jobTitle);

    });

    it('13. Fungsi Show Sidebar Detail User', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        directoryPage.elements.getSidebarUserDetail().should('not.be.exist');
        directoryPage.elements.getEmployeeCards().eq(0).click();
        directoryPage.elements.getSidebarUserDetail().should('be.exist').and('be.visible');
    });

    it('14. Fungsi Hide Sidebar Detail User', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        directoryPage.elements.getSidebarUserDetail().should('not.be.exist');
        directoryPage.elements.getEmployeeCards().eq(0).click();
        directoryPage.elements.getSidebarUserDetail().should('be.exist').and('be.visible');

        directoryPage.elements.getSidebarArrowRight().click();
        directoryPage.elements.getSidebarUserDetail().should('not.be.exist');
    });

    it('15. Pencarian berdasarkan Job Title saja - Mock API - Slow Connection', () => {
        cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
        cy.wait('@getEmployees');

        cy.intercept('GET', '**/api/v2/directory/employees?limit=**', {
            delay: 3000,
            statusCode: 200,
            body: {
                data: [
                    {
                        "empNumber": 9999,
                        "lastName": "",
                        "firstName": userDataTest.directorySearch.validUser.fullName,
                        "middleName": "",
                        "terminationId": null,
                        "jobTitle": {
                            "id": 23,
                            "title": userDataTest.directorySearch.validUser.jobTitle,
                            "isDeleted": false
                        },
                        "subunit": {
                            "id": 13,
                            "name": "Human Resources"
                        },
                        "location": {
                            "id": 5,
                            "name": userDataTest.directorySearch.validUser.location,
                        }
                    }
                ],
                "meta": {
                    "total": 1
                },
                "rels": []
            }
        }).as('mockSearchJobResult');

        directoryPage.selectJobTitle(userDataTest.directorySearch.validUser.jobTitle);
        directoryPage.elements.getSearchBtn().click();

        directoryPage.elements.getLoader().should('be.visible');
        cy.wait('@mockSearchJobResult').then((res) => {
            directoryPage.elements.getLoader().should('not.exist');
            directoryPage.elements.getEmployeeCards().each(($el) => {
                cy.wrap($el).should('contain', userDataTest.directorySearch.validUser.jobTitle);
            });
        });
    });
});