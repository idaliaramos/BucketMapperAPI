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
      this._logError(error);
      throw this._createUnexpectedError();
    }
  }
  async getAll() {
    try {
      const records = await this._db(this._entityName);
      return records.map(record => omit(record, isFunction));
    } catch (error) {
      this._logError(error);
      throw this._createUnexpectedError();
    }
  }
}
module.exports = EntityRepository;
