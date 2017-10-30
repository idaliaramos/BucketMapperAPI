const express = require('express');
const Boom = require('boom');
const router = express.Router();

const userController = require('./userController');

router.post('/users', userController.create);
// router.get('/users', userController.getAll);

router.all('/users', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'POST']))
);

// router.get('/users/:id(\\d+)', userController.getById);
// router.patch('/users/:id(\\d+)', userController.update);
// router.delete('/users/:id(\\d+)', userController.delete);
// router.all('/users/:id(\\d+)', (request, response, next) =>
//   next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'PATCH', 'DELETE']))
// );

module.exports = router;
