import reqresPage from '../../support/api/reqresPage';

describe('API Testing Reqres Users', () => {

    it('1. Get List User (Datatable) - use apikey', () => {
        reqresPage.getListUsers(1).then((res) => {
            expect(res.requestHeaders).to.have.property('x-api-key');
            reqresPage.verifyGetListUsersSuccess(res, 1);
        });
    })

    it('2. Get List User (Datatable) - not use apikey', () => {
        reqresPage.getListUsersWithoutApikey(1).then((res) => {
            expect(res.requestHeaders).to.not.have.property('x-api-key');
            reqresPage.verifyGetListUsersSuccess(res, 1);
        });
    })

    it('3. Get User by ID', () => {
        reqresPage.getUserById(1).then((res) => {
            expect(res.status).to.eq(200);
            expect(res.requestHeaders).to.have.property('x-api-key');
            expect(res.body.data).to.not.be.null;
            expect(res.body.data).to.include.keys('id', 'first_name');
            expect(res.body.data.id).to.eq(1);
        });
    })

    it('4. Get User by ID - Not Found', () => {
        reqresPage.getUserById(11111, false).then((res) => {
            expect(res.requestHeaders).to.have.property('x-api-key');
            expect([400, 404]).to.include(res.status);
            expect(res.body).to.be.empty;
        });
    })
})