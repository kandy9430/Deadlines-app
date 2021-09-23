const sanitizeHtml = require("sanitize-html");

const BaseJoi = require("joi");
BaseJoi.objectId = require("joi-objectid")(BaseJoi);

const sanitizeHtmlExtension = (joi) => {
  return {
    type: "string",
    base: BaseJoi.string(),
    messages: {
      "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
      escapeHTML: {
        validate(value, helpers) {
          const clean = sanitizeHtml(value, {
            allowedTags: [],
            allowedAttributes: {},
          });
          if (clean !== value) {
            return helpers.error("string.escapeHTML", { value });
          }
          return clean;
        },
      },
    },
  };
};

const Joi = BaseJoi.extend(sanitizeHtmlExtension);

module.exports.categorySchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
});

module.exports.documentSchema = Joi.object({
  // need to figure out how to allow either an array or a string (depending on how many categories are selected)
  category: Joi.alternatives()
    .try(Joi.array().items(Joi.objectId()), Joi.objectId())
    .required(),
  name: Joi.string().required().escapeHTML(),
  description: Joi.string().required().escapeHTML(),
  issuingAuthority: Joi.string().required().escapeHTML(),
  website: Joi.string().required().escapeHTML(),
});

module.exports.expirationSchema = Joi.object({
  document: Joi.objectId().required(),
  expires: Joi.date().greater("now").required(),
});

module.exports.recurringSchema = Joi.object({
  category: Joi.string().required().escapeHTML(),
  name: Joi.string().required().escapeHTML(),
  interval: Joi.number().min(1).max(12).required(),
  nextDue: Joi.date().greater("now").required(),
});
