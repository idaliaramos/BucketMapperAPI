const Yup = require('yup');

const Validator = require('../validators/Validator');

const schemas = {
  forCreate: {
    name: Yup.string().trim().required().min(2),
    description: Yup.string().trim(),
    location: Yup.string().trim(),
    url: Yup.string().trim().min(5)
  },
  forUpdate: {
    name: Yup.string().trim().min(2),
    description: Yup.string().trim(),
    location: Yup.string().trim(),
    url: Yup.string().trim().min(5)
  }
};

module.exports = new Validator({
  name: 'Adventure',
  schemas
  //add debug?
});
