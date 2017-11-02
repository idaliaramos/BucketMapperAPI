process.env.NODE_ENV = 'test';

const HttpMock = require('node-mocks-http');
// const jest = require('jest');
// const Boom = require('boom');
const EntityController = require('./EntityController');

describe('EntityController', () => {
  const entityService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn()
  };
  const entityController = new EntityController({
    entityName: 'Entity',
    entityService
  });

  describe('create', () => {
    it('should respond a created Entity', async () => {
      const inputEntity = {
        name: 'entityname',
        description: 'a description'
      };

      const expectedEntity = Object.assign({}, inputEntity, { id: 1 });

      const request = HttpMock.createRequest({ body: inputEntity });
      const response = HttpMock.createResponse();

      entityService.create.mockReturnValueOnce(Promise.resolve(expectedEntity));

      await entityController.create(request, response, () => {});

      const actualEntity = JSON.parse(response._getData());

      expect(actualEntity).toEqual(expectedEntity);
      expect(response._isJSON()).toBe(true);
      expect(response._getStatusCode()).toBe(201);
      expect(response._getHeaders().Location).toBe(`/entities/1`);
    });
  });
});
