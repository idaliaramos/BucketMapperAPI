const express = require('express');
const Boom = require('boom');
const router = express.Router();

const destinationController = require('./destinationController');
//finished POST
router.post('/users/:id/destinations', destinationController.createForUser);
//finished GET
router.get('/users/:id/destinations', destinationController.findByUserId);
router.all('/user/:id/destinations', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'POST']))
);

router.get('/destinations/:id(\\d+)', destinationController.getById);
//finished PATCH
router.patch('/destinations/:id(\\d+)', destinationController.update);
//finished
router.delete('/destinations/:id(\\d+)', destinationController.delete);
router.all('/destinations/:id(\\d+)', (request, response, next) =>
  next(Boom.methodNotAllowed(null, null, ['OPTIONS', 'GET', 'PATCH', 'DELETE']))
);

module.exports = router;
