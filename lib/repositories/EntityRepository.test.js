process.env.NODE_ENV = 'test';
const knex = require('knex');
const KnexMock = require('mock-knex');
const EntityRepository = require('./EntityRepository');
const { omit } = require('../utils/ObjectUtils');

describe('EntityRepository', () => {
  const db = knex({ client: 'pg' });
  let entityRepository = null;
  let knexTracker = null;

  beforeAll(() => {
    KnexMock.mock(db);
    entityRepository = new EntityRepository({
      entityName: 'Entity',
      db,
      logError: console.error // eslint-disable-line no-console
    });
  });

  beforeEach(() => {
    knexTracker = KnexMock.getTracker();
    knexTracker.install();
  });

  describe('create', () => {
    it('should create an Entity', async () => {
      const inputEntity = {
        name: 'Some name',
        description: 'Some description'
      };

      const expectedEntity = Object.assign({}, inputEntity, { id: 1 });

      knexTracker.on('query', (query, step) => {
        expect(query.method).toBe('insert');
        query.response([expectedEntity]);
      });

      const actualEntity = await entityRepository.create(inputEntity);

      expect(actualEntity).toEqual(expectedEntity);
      expect(omit(actualEntity, 'id')).toEqual(inputEntity);
    });
  });

  afterEach(() => {
    knexTracker.uninstall();
  });

  afterAll(() => {
    KnexMock.unmock(db);
  });
});
