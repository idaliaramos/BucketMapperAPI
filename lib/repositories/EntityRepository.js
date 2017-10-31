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
      // console.log(error);
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

  async getAll() {
    try {
      const records = await this._db(this._entityName);
      return records.map(record => omit(record, isFunction));
    } catch (error) {
      // this._logError(error);
      // throw this._createUnexpectedError();
    }
  }

  async getById(id) {
    try {
      const [record] = await this._db(this._entityName).where({ id });
      return record ? omit(record, isFunction) : null;
    } catch (error) {
      // console.log(error);
    }
  }

  async getByIds(ids) {
    try {
      const records = await this._db(this._entityName).whereIn('id', ids);
      return records.map(record => omit(record, isFunction));
    } catch (error) {
      // this._logError(error);
      //   throw this._createUnexpectedError();
    }
  }

  async findByAttribute(attributeName, attributeValue) {
    try {
      const records = await this._db(this._entityName).where(
        attributeName,
        attributeValue
      );
      return records.map(record => omit(record, isFunction));
    } catch (error) {
      // this._logError(error);
      // throw this._createUnexpectedError();
    }
  }

  async update(id, attributes) {
    // let newAttributes = Object.assign({}, attributes);
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

  _createUnexpectedError() {
    throw new Error(
      EntityRepository.ERROR_UNEXPECTED.replace('Entity', this._entityName)
    );
  }
}

EntityRepository.ERROR_UNEXPECTED = 'EntityRepository.ERROR_UNEXPECTED';

module.exports = EntityRepository;
