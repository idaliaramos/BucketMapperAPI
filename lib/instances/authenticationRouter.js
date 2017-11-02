const express = require('express');
const Boom = require('boom');
const router = express.Router();

const authenticationController = require('./authenticationController');

router.post('/authenticate', authenticationController.authenticate);
router.all('/authenticate', (request, response, next) => {
  // console.log(
  //   authenticationController.authenticate({ name: foo }),
  //   'the controller'
  // );
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'POST']));
});

module.exports = router;
