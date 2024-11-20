const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().min(2).max(100).required('name is required'),
    email: Joi.string().email().required('email is required'),
    age: Joi.number().integer().min(1).max(100).required('age is required'),
});

module.exports = userSchema;
