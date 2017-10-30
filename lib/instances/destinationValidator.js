const Yup = require('yup');

const Validator = require('../validators/Validator');

const { DEBUG } = require('../../env');

const schemas = {
  forCreate: {
    name: Yup.string().trim().required().min(2),
    url: Yup.string().trim().min(5)
  },
  forUpdate: {
    name: Yup.string().trim().min(2),
    url: Yup.string().trim().min(5)
  }
};

module.exports = new Validator({
  name: 'Destination',
  schemas,
  logError: DEBUG ? console.error : undefined // eslint-disable-line no-console
});
