process.env.NODE_ENV = 'test';

const HttpMock = require('node-mocks-http');
// const jest = require('jest');
// const Boom = require('boom');
const UserController = require('../instances/userController');

describe('EntityController', () => {
  // const entityService = {
  //   create: jest.fn()
  // };
  const userController = new UserController();

  describe('create', () => {
    it('should respond a created Entity', async () => {
      const user = {
        name: 'entityname',
        email: 'email@email.com',
        password: 'a description'
      };

      const expectedEntity = Object.assign({}, user, { id: 1 });

      const request = HttpMock.createRequest({ body: user });
      const response = HttpMock.createResponse();

      //entityService.create.mockReturnValueOnce(Promise.resolve(expectedEntity));

      await userController.create(request, response, () => {});

      const actualEntity = JSON.parse(response._getData());

      expect(actualEntity).toEqual(expectedEntity);
      expect(response._isJSON()).toBe(true);
      expect(response._getStatusCode()).toBe(200);
      expect(response._getHeaders().Location).toBe(`/users/1`);
    });
  });
});
