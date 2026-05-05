describe('OrangeHRM Login Feature Testing', () => {
  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.fixture('user').as('userData');
  });

  it('Skenario Positif: Berhasil login dengan username dan password yang benar (Cek Response)', function() {
    cy.intercept('POST', '**/auth/validate').as('loginSuccess');

    cy.get('input[name="username"]').type(this.userData.validUser.username);
    cy.get('input[name="password"]').type(this.userData.validUser.password);
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess').then((intercept) => {
      const responseHeaders = intercept.response.headers;

      expect(responseHeaders['location']).to.include('/dashboard/index');
      expect(responseHeaders).to.have.property('set-cookie');
      expect(responseHeaders['set-cookie'][0]).to.include('orangehrm=');
    })
  });

  it('Skenario Negatif: Gagal login (username salah & password benar | Cek Response)', function() {
    cy.intercept('POST', '**/auth/validate').as('loginFailed');

    cy.get('input[name="username"]').type(this.userData.invalidPassword.username);
    cy.get('input[name="password"]').type(this.userData.invalidPassword.password);
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFailed').then((intercept) => {
      const responseHeaders = intercept.response.headers;

      expect(responseHeaders['location']).to.include('/auth/login');
      expect(responseHeaders).not.to.have.property('set-cookie');
    })
  });

  it('Skenario Positif: Berhasil login dengan username dan password yang benar (Mock Response)', function() {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.intercept('POST', '**/auth/validate', (req) => {
      req.reply((res) => {
        delete res.headers['set-cookie'];
        delete res.headers['Set-Cookie'];

        res.send({
          statusCode: 302,
          headers: {
              'location': 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index',
              'Set-Cookie': 'orangehrm=mock_session_id; path=/web; secure; HttpOnly; SameSite=Lax'
          },
          body: ''
        })
      })
    }).as('mockLoginSuccess');

    cy.intercept('GET', '**/dashboard/index', (req) => {
        req.reply({
          statusCode: 200,
          body: ''
        })
    }).as('mockIndex');

    cy.get('input[name="username"]').type(this.userData.validUser.username);
    cy.get('input[name="password"]').type(this.userData.validUser.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard/index');
    cy.getCookie('orangehrm').should('have.property', 'value', 'mock_session_id');
  });

  it('Skenario Negatif: Gagal login (username salah & password benar | Mock Response)', function() {
    cy.intercept('POST', '**/auth/validate', (req) => {
      req.reply((res) => {
        delete res.headers['set-cookie'];
        delete res.headers['Set-Cookie'];

        res.send({
          statusCode: 302,
          headers: {
              'location': 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login',
              'mock-validate': 'yes'
          },
          body: ''
        })
      })
    }).as('mockLoginFailed');

    cy.get('input[name="username"]').type(this.userData.invalidPassword.username);
    cy.get('input[name="password"]').type(this.userData.invalidPassword.password);
    cy.get('button[type="submit"]').click();

    cy.wait('@mockLoginFailed').then((intercept) => {
      const responseHeaders = intercept.response.headers;

      expect(responseHeaders['location']).to.include('/auth/login');
      expect(responseHeaders).to.have.property('mock-validate');
    })

    cy.get('.oxd-alert-content-text')
      .should('be.visible')
      .and('have.text', 'Invalid credentials');
  });

  it('Skenario Positif: Slow login', function() {
    cy.intercept('POST', '**/auth/validate', (req) => {
      req.on('response', (res) => {
        res.setDelay(3000); 
      });
    }).as('slowLogin');

    cy.get('input[name="username"]').type(this.userData.validUser.username);
    cy.get('input[name="password"]').type(this.userData.validUser.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard/index');
    cy.get('.oxd-topbar-header-breadcrumb-module')
      .should('be.visible')
      .and('have.text', 'Dashboard');
  });

  it('Skenario Negatif: Server Error', function() {
    cy.intercept('POST', '**/auth/validate', (req) => {
      req.reply({
        statusCode: 500
      });
    }).as('serverError');

    cy.get('input[name="username"]').type(this.userData.validUser.username);
    cy.get('input[name="password"]').type(this.userData.validUser.password);
    cy.get('button[type="submit"]').click();
  });
})