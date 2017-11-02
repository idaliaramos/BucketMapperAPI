//in the entity controller I handle the middleware requests

const Boom = require('boom');
const { pluralize } = require('../utils/StringUtils');

class EntityController {
  constructor({ entityName, entityService }) {
    this._entityName = entityName;
    this._entityService = entityService;
    this._bindMethods(['create', 'getAll', 'getById', 'update', 'delete']);
  }

  async create(request, response, next) {
    // console.log(request.body, 'this is the body');
    try {
      const entity = await this._entityService.create(request.body, {
        userId: request.authenticatedUserId
      });
      console.log(entity, 'this is the enity');
      response
        .status(201)
        .set(
          'Location',
          `/${pluralize(this._entityName.toLowerCase())}/${entity.id}`
        )
        .json(entity);
    } catch (error) {
      console.log('>>>>>>>>>>>>', error);
      // next(this._convertError(error));
    }
  }
  async getAll(request, response, next) {
    try {
      const entities = await this._entityService.getAll({
        userId: request.authenticatedUserId
      });
      response.json(entities);
    } catch (error) {
      console.log(error);
    }
  }

  async getById(request, response, next) {
    try {
      const id = parseInt(request.params.id);
      const entity = await this._entityService.getById(id, {
        userId: request.authenticatedUserId
      });
      response.json(entity);
    } catch (error) {
      next(this._convertError(error));
    }
  }

  async update(request, response, next) {
    console.log('iam here');
    try {
      const id = parseInt(request.params.id);
      console.log(id, 'inthe update');
      console.log(request.body, 'body');

      const entity = await this._entityService.update(id, request.body, {
        userId: request.authenticatedUserId
      });
      response.json(entity);
    } catch (error) {
      console.log(error, 'this is the error<<<<<<<<<<<<');
      // next(this._convertError(error));
    }
  }

  async delete(request, response, next) {
    try {
      const id = parseInt(request.params.id);
      const entity = await this._entityService.delete(id, {
        userId: request.authenticatedUserId
      });
      response.json(entity);
    } catch (error) {
      console.log(error);
    }
  }

  _bindMethods(methodNames) {
    methodNames.forEach(methodName => {
      this[methodName] = this[methodName].bind(this);
    });
  }

  _convertError(error) {
    if (error.message.endsWith('Service.ERROR_INVALID_INPUT')) {
      return Boom.badRequest(error.message);
    }
    if (error.message.endsWith('Service.ERROR_PERMISSION_DENIED')) {
      return Boom.forbidden(error.message);
    }
    if (error.message.endsWith('Service.ERROR_NOT_FOUND')) {
      return Boom.notFound(error.message);
    }
    if (error.message.endsWith('Service.ERROR_UNEXPECTED')) {
      return Boom.badImplementation(error.message);
    }
    return Boom.badImplementation();
  }
}

module.exports = EntityController;
