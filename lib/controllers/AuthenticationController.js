const Boom = require('boom');
const { noop } = require('../utils/FunctionUtils');
const { isFunction } = require('../utils/LangUtils');
class AuthenticationController {
  constructor({ authenticationService, logError }) {
    this._authenticationService = authenticationService;
    this.authenticate = this.authenticate.bind(this);
    // this._logError = isFunction(logError) ? logError : noop;
  }

  async authenticate(request, response, next) {
    try {
      const userInfo = request.body;
      // if (userInfo.name === undefined || userInfo.email === undefined) {
      //   throw Boom.badRequest('invalid query');
      // }
      const token = await this._authenticationService.authenticate(userInfo);
      if (!token) {
        throw Boom.badRequest('invalid query');
      }
      response.json({ token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthenticationController;
