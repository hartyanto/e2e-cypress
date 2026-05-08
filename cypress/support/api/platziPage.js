class platziPage {
    constructor() {
        this.baseUrl = 'https://api.escuelajs.co/api/v1';
    }

    getListCategories() {
        return cy.request('GET', `${this.baseUrl}/categories`)
    }

    getCategoryById(id, failOnStatus = true) {
        return cy.request({
            method: 'GET',
            url: `${this.baseUrl}/categories/${id}`,
            failOnStatusCode: failOnStatus
        })
    }

    createCategory(payload) {
        return cy.request('POST', `${this.baseUrl}/categories`, payload);
    }

    updateCategory(id, payload) {
        return cy.request('PUT', `${this.baseUrl}/categories/${id}`, payload);
    }

    deleteCategory(id, failOnStatus = true) {
        return cy.request({
            method: 'DELETE',
            url: `${this.baseUrl}/categories/${id}`,
            failOnStatusCode: failOnStatus
        });
    }

    verifyCategoryNotFound(res) {
        expect(res.status).to.eq(400);
        expect(res.body).to.not.be.null
        expect(res.body).to.have.property('name');
        expect(res.body.name).to.eq('EntityNotFoundError');
    }
}

export default new platziPage();
