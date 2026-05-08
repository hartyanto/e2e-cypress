import platziPage from '../../support/api/platziPage';

describe('API Testing Platzi Categories', () => {
    let testData;
    const createdIds = [];

    before(() => {
        cy.fixture('apiPlatzi').then((data) => {
            testData = data;
        });
    });

    it('1. Get All Collection', () => {
        platziPage.getListCategories().then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.not.be.null;
            expect(res.body).to.be.an('array');
        });
    })

    it('2. Get Collection by id - Found', () => {
        platziPage.getCategoryById(1).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.not.be.null;
            expect(res.body.id).to.eq(1);
            expect(res.body).to.have.property('name');
        });
    })

    it('3. Get Collection by id - Not Found', () => {
        platziPage.getCategoryById(9999, false).then((res) => {
            platziPage.verifyCategoryNotFound(res);
        });
    })

    it('4. Create category', () => {
        testData.newCategories.forEach((category) => {
            platziPage.createCategory(category).then((res) => {
                expect(res.status).to.eq(201);
                expect(res.body.name).to.eq(category.name);
                expect(res.body).to.have.property('id');

                createdIds.push({
                    id: res.body.id,
                    name: category.name
                });
            })
        });
    })

    it('5. Check Collection Created by id', () => {
        createdIds.forEach((category) => {
            platziPage.getCategoryById(category.id).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body).to.not.be.null
                expect(res.body.id).to.eq(category.id);
                expect(res.body).to.have.property('name');
                expect(res.body.name).to.eq(category.name);
            });
        })
    })

    it('6. Update Collection by id', () => {
        createdIds.forEach((category) => {
            const payload = testData.udpateCategories.find(i => i.name === category.name);
            if (payload) {
                payload.name =  payload.new_name;
                delete payload.new_name;

                platziPage.updateCategory(category.id, payload).then((res) => {
                    expect(res.status).to.eq(200);
                    expect(res.body).to.not.be.null
                    expect(res.body.id).to.eq(category.id);
                    expect(res.body).to.have.property('name');
                    expect(res.body.name).to.eq(payload.name );
                });
             }
        })
    })

    it('7. Delete category', () => {
        createdIds.forEach((category) => {
            platziPage.deleteCategory(category.id, false).then((res) => {
                expect(res.status).to.eq(200);
                expect(res.body).to.eq('true');
            })
        });
    })

    it('8. Check category deleted', () => {
        createdIds.forEach((category) => {
            platziPage.getCategoryById(category.id, false).then((res) => {
                platziPage.verifyCategoryNotFound(res);
            });
        })
    })
})