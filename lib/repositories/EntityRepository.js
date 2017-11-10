const { omit } = require('../utils/ObjectUtils');
const { pick } = require('../utils/ObjectUtils');
const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');

class EntityRepository {
  constructor({ entityName, db, logError }) {
    this._entityName = entityName;
    this._db = db;
    this._logError = isFunction(logError) ? logError : noop;
  }

  async create(attributes) {
    try {
      const [record] = await this._db(this._entityName)
        .insert(attributes)
        .returning('*');
      return omit(record, isFunction);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async createForUser(id, attributes) {
    let newAttributes = Object.assign({}, attributes, { userId: id });

    try {
      const [record] = await this._db(this._entityName)
        .insert(newAttributes)
        .where('userId', id)
        .returning('*');
      return omit(record, isFunction);
    } catch (error) {
      // console.log(error);
    }
  }

  async createForDestination(id, attributes) {
    let newAttributes = Object.assign({}, attributes, { destinationId: id });

    try {
      const [record] = await this._db(this._entityName)
        .insert(newAttributes)
        .where('destinationId', id)
        .returning('*');
      return omit(record, isFunction);
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    console.log(id, 'getById');
    try {
      //TODO: delete password
      let [record] = await this._db(this._entityName).where({ id });
      // console.log(
      //   record ? omit(record, isFunction,) : null,
      //   '<<<<<<<<<'
      // );
      // return record ? omit(record, isFunction) : null;
      record = Object.assign({}, record);
      console.log('-----------------------------------------------------');
      console.log(record, 'from repository');
      console.log('-----------------------------------------------------');

      return record;
    } catch (error) {
      console.log(error);
    }
  }
  async getRecord(id) {
    console.log(id, 'getById');
    try {
      //TODO: delete password
      let [record] = await this._db(this._entityName).where({ id });
      // console.log(
      //   record ? omit(record, isFunction,) : null,
      //   '<<<<<<<<<'
      // );

      record = record ? omit(record, isFunction) : null;
      // record = record ? pick(record, [record.userId]) : null;
      console.log(record, 'this is the record');

      return record;
      // return record;
    } catch (error) {
      console.log(error);
    }
  }

  async findByAttribute(attributeName, attributeValue) {
    console.log(attributeName, attributeValue, 'these are the IDS TODAY REPOS');
    try {
      const records = await this._db(this._entityName).where(
        attributeName,
        attributeValue
      );
      //doestn seem to be returning the records
      return records ? records.map(record => omit(record, isFunction)) : null;
    } catch (error) {
      console.log(error);
      // throw this._createUnexpectedError();
    }
  }

  async update(id, attributes) {
    console.log('in the repo fo rupdtate');
    let newAttributes = Object.assign({}, attributes);
    console.log(newAttributes);
    try {
      const [record] = await this._db(this._entityName)
        .update(newAttributes)
        .returning('*')
        .where({ id });
      return record ? omit(record, isFunction) : null;
    } catch (error) {
      // this._logError(error);
      // throw this._createUnexpectedError();
    }
  }

  async delete(id) {
    try {
      const [record] = await this._db(this._entityName)
        .delete()
        .returning('*')
        .where({ id });
      return record ? omit(record, isFunction) : null;
    } catch (error) {
      // this._logError(error);
      // throw this._createUnexpectedError();
    }
  }

  async getByIds(ids) {
    try {
      const records = await this._db(this._entityName).whereIn(
        'destinationId',
        ids
      );
      // console.log(records, 'this is the the get by Ids');
      return records.map(record => omit(record, isFunction));
    } catch (error) {
      console.log(error);
      // this._logError(error);
      // throw this._createUnexpectedError();
    }
  }

  _createUnexpectedError() {
    throw new Error(
      EntityRepository.ERROR_UNEXPECTED.replace('Entity', this._entityName)
    );
  }
}

EntityRepository.ERROR_UNEXPECTED = 'EntityRepository.ERROR_UNEXPECTED';

module.exports = EntityRepository;
