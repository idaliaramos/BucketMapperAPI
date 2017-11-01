const { omit } = require('../utils/ObjectUtils');
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
    console.log(id, attributes, 'inthe entity repository');
    let newAttributes = Object.assign({}, attributes, { destinationId: id });
    console.log(newAttributes);
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
    try {
      const [record] = await this._db(this._entityName).where({ id });
      return record ? omit(record, isFunction) : null;
    } catch (error) {
      console.log(error);
    }
  }

  async findByAttribute(attributeName, attributeValue) {
    console.log(attributeName, attributeValue, 'in the Repository');
    try {
      const records = await this._db(this._entityName).where(
        attributeName,
        attributeValue.id
      );
      //doestn seem to be returning the records
      return records ? records.map(record => omit(record, isFunction)) : null;
    } catch (error) {
      console.log(error);
      // throw this._createUnexpectedError();
    }
  }

  async update(id, attributes) {
    let newAttributes = Object.assign({}, attributes);
    console.log(newAttributes);
    try {
      const [record] = await this._db(this._entityName)
        .update(attributes)
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