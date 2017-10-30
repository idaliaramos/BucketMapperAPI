const express = require('express');
const Boom = require('boom');
const router = express.Router();

const destinationController = require('./destinationController');

router.post('users/1/estination', destinationController.create);
router.get('users/1/destinations', destinationController.getAll);
// router.all('/destinations', (request, response, next) =>
//   next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'POST']))
// );

router.get('/destinations/:id(\\d+)', destinationController.getById);
router.patch('/destinations/:id(\\d+)', destinationController.update);
router.delete('/destinations/:id(\\d+)', destinationController.delete);
router.all('/destinations/:id(\\d+)', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'PATCH', 'DELETE']))
);

module.exports = router;
