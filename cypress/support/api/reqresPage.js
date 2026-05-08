class apiReqresPage {
    constructor() {
        this.baseUrl = 'https://reqres.in/api';
        this.config = Cypress.env('reqres') || {};
        this.api_key = this.config.api_key || 'default_key';
    }

    getListUsers(page = 1) {
        return cy.request({
            method: 'GET',
            url: `${this.baseUrl}/users?page=${page}`,
            headers: {
                'x-api-key': this.api_key
            }
        })
    }

    getListUsersWithoutApikey(page = 1) {
        return cy.request({
            method: 'GET',
            url: `${this.baseUrl}/users?page=${page}`,
        })
    }

    getUserById(id, failOnStatus = true) {
        return cy.request({
            method: 'GET',
            url: `${this.baseUrl}/users/${id}`,
            headers: {
                'x-api-key': this.api_key
            },
            failOnStatusCode: failOnStatus
        })
    }

    verifyGetListUsersSuccess(res, page) {
        expect(res.status).to.eq(200);
        expect(res.body.page).to.not.be.null;
        expect(res.body.page).to.eq(page);
        expect(res.body.data).to.be.an('array');
    }
}


export default new apiReqresPage();