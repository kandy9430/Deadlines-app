const Expiration = require("./models/document/expiration");
const Recurring = require("./models/recurring/recurring");
const User = require("./models/user");
const Document = require("./models/document/document");
const {
  expirationSchema,
  recurringSchema,
  categorySchema,
  documentSchema,
} = require("./schemas");
const ExpressError = require("./utils/expressError");

module.exports.validateCategory = (req, res, next) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};

module.exports.validateDocument = (req, res, next) => {
  const { error } = documentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};

module.exports.validateExpiration = (req, res, next) => {
  const { error } = expirationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};

module.exports.isExpirationUnique = async (req, res, next) => {
  const foundDocument = await Document.findById(req.body.document.toString());
  const user = await User.findById(req.user._id).populate("documents");
  userDocuments = user.documents.map((doc) => doc.document._id);
  if (userDocuments.includes(foundDocument._id.toString())) {
    req.flash(
      "error",
      `You already have a ${foundDocument.name} linked to your account. Please try again using a new document.`
    );
    res.redirect("/deadlines/new/document");
  } else {
    return next();
  }
};

module.exports.validateRecurring = (req, res, next) => {
  const { error } = recurringSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    return next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in");
    return res.redirect("/login");
  }
  return next();
};

module.exports.isExpirationOwner = async (req, res, next) => {
  const { id } = req.params;
  const expiration = await Expiration.findById(id);
  if (!expiration.owner.equals(req.user._id)) {
    req.flash(
      "error",
      "The document you are trying to access is not linked to your account"
    );
    return res.redirect("/deadlines");
  }
  return next();
};

module.exports.isRecurringOwner = async (req, res, next) => {
  const { id } = req.params;
  const recurring = await Recurring.findById(id);
  if (!recurring.owner.equals(req.user._id)) {
    req.flash(
      "error",
      "The deadline you are trying to access is not linked to your account"
    );
    return res.redirect("/deadlines");
  }
  return next();
};

module.exports.isAdmin = async (req, res, next) => {
  if (!req.user.admin) {
    req.flash("error", "You do not have access to this");
    return res.redirect("/");
  }
  return next();
};

module.exports.isNotificationOwner = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  const notification = user.notifications.id(id);
  if (!notification) {
    req.flash(
      "error",
      "The notification you are trying to access is not linked to your account"
    );
    return res.redirect("/deadlines");
  }
  return next();
};
