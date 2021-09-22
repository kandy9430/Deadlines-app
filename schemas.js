const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports.categorySchema = Joi.object({
  name: Joi.string().required(),
});

module.exports.documentSchema = Joi.object({
  // need to figure out how to allow either an array or a string (depending on how many categories are selected)
  category: Joi.alternatives()
    .try(Joi.array().items(Joi.objectId()), Joi.objectId())
    .required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  issuingAuthority: Joi.string().required(),
  website: Joi.string().required(),
});

module.exports.expirationSchema = Joi.object({
  document: Joi.objectId().required(),
  expires: Joi.date().greater("now").required(),
});

module.exports.recurringSchema = Joi.object({
  category: Joi.string().required(),
  name: Joi.string().required(),
  interval: Joi.number().min(1).max(12).required(),
  nextDue: Joi.date().greater("now").required(),
});
