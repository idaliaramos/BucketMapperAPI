const AuthenticationService = require('../services/AuthenticationService');

const { JWT_KEY } = require('../../env');

module.exports = new AuthenticationService({
  authenticationValidator: require('./authenticationValidator'),
  jwtSecretKey: JWT_KEY,
  userRepository: require('./userRepository')
});
