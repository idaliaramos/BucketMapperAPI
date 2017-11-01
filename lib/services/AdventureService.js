const { isFunction } = require('../utils/LangUtils');
const { noop } = require('../utils/FunctionUtils');
const { pick, omit } = require('../utils/ObjectUtils');

class AdventureService {
  constructor({
    // adventureValidator,
    adventureRepository,
    destinationRepository,
    logError
  }) {
    // this._destinationValidator = destinationValidator;
    this._adventureRepository = adventureRepository;
    this._destinationRepository = destinationRepository;
    // this._logError = isFunction(logError) ? logError : noop;
  }

  async createForDestination(id, attributes) {
    console.log(id, attributes, 'this is the attributes in the d service');
    try {
      const destination = await this._destinationRepository.getById(id);
      return await this._adventureRepository.create(
        Object.assign({}, attributes, {
          destinationId: id,
          userId: destination.userId
        })
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  // async findById(userId) {
  //   return await this._destinationRepository.findByAttribute('userId', userId);
  // }
  // async getById(adventureId) {
  //   console.log(adventureId, 'inthe Service');
  //   return await this._adventureRepository.findByAttribute(
  //     'adventureId',
  //     adventureId.id
  //   );
  // }
  // async delete(id) {
  //   return await this._adventureRepository.delete(id);
  // }
  async getById(adventureId) {
    console.log(adventureId, 'inthe Service');
    return await this._adventureRepository.findByAttribute('id', adventureId);
  }
  async delete(id) {
    return await this._adventureRepository.delete(id);
  }
  async update(id, attributes) {
    try {
      const adventure = await this._adventureRepository.update(id, attributes);
      if (!adventure) throw this._createNotFoundError();
      return await this._adventureRepository.update(id, attributes);
    } catch (error) {
      console.log(error);
      // this._logError(error);
    }
  }
}
module.exports = AdventureService;