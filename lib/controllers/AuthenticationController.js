const Boom = require('boom');

class AuthenticationController {
  constructor({ authenticationService }) {
    this._authenticationService = authenticationService;
    this.authenticate = this.authenticate.bind(this);
  }

  async authenticate(request, response, next) {
    console.log(request.body, 'i am in the authentication controller');
    try {
      const userInfo = request.body;
      const token = await this._authenticationService.authenticate(userInfo);
      console.log(token, 'this is the token given');
      response.json({ token });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = AuthenticationController;
