const Joi = require("joi");

const registerJoiSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),

  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),

  //role: Joi.string().valid("user", "admin").default("user"),
});

const loginJoiSchema = Joi.object({
  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),
});

module.exports = {
  registerJoiSchema,
  loginJoiSchema,
};
