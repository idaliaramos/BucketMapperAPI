const Yup = require('yup');

const Validator = require('../validators/Validator');

const schemas = {
  forCreate: {
    name: Yup.string().trim().required().min(2),
    email: Yup.string().trim().lowercase().required().min(5),
    password: Yup.string().min(3)
  },
  forUpdate: {
    name: Yup.string().trim().min(2),
    email: Yup.string().trim().lowercase().min(6)
  }
};

module.exports = new Validator({
  name: 'User',
  schemas
  //add error handling
});
