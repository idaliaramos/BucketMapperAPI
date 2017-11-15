const Boom = require('boom');
const { isFunction } = require('../utils/LangUtils');
class AuthenticationController {
  constructor({ authenticationService, logError }) {
    this._authenticationService = authenticationService;
    this.authenticate = this.authenticate.bind(this);
    this._logError = isFunction(logError) ? logError : noop;
  }

  async authenticate(request, response, next) {
    console.log(request.body, 'i am in the authentication controller');
    try {
      const userInfo = request.body;
      if (userInfo.name === '' || userInfo.email === '') {
        throw this._createInvalidInputError();
      }
      const token = await this._authenticationService.authenticate(userInfo);
      console.log(token, 'this is the token given');
      response.json({ token });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = AuthenticationController;
