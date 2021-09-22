const Category = require("../models/document/category");
const Document = require("../models/document/document");
const Expiration = require("../models/document/expiration");
const Recurring = require("../models/recurring/recurring");
const User = require("../models/user");
const recurringHelpers = require("../utils/recurringHelpers");

/***************************************************************/
/************************* Documents ***************************/
/***************************************************************/

module.exports.showTypeForm = (req, res) => {
  res.render("deadlines/new/type");
};

module.exports.redirectFromTypeForm = (req, res) => {
  const { type } = req.body;
  res.redirect(`/deadlines/new/${type}`);
};

module.exports.newDocumentForm = async (req, res) => {
  const categories = await Category.find({});
  const documents = await Document.find({});
  delete req.session.selectedCategory;
  res.render("deadlines/new/document", { categories, documents });
};

module.exports.createNewDocument = async (req, res) => {
  // req.body returns the value from the input. So for document, the value is taken from the option because it's in a select. We set thhe document id as the value so we get back the id and need to make it a string to look up the actual document in the db by id
  const { document, expires } = req.body;
  const foundDocument = await Document.findById(document.toString());
  const expiration = new Expiration({ expires });
  expiration.document = foundDocument;
  expiration.owner = req.user._id;
  const savedExpiration = await expiration.save();
  // push the expiration onto the user
  const user = await User.findById(req.user._id);
  user.documents.push(savedExpiration);
  await user.save();
  req.flash("success", `Successfully added ${foundDocument.name} expiration`);
  res.redirect("/deadlines");
};

module.exports.addDocumentCategoryToSession = (req, res) => {
  req.session.selectedCategory = req.body.category;
  res.redirect("/deadlines/new/document");
};

/***************************************************************/
/************************* Recurring ***************************/
/***************************************************************/

module.exports.newRecurringForm = (req, res) => {
  res.render("deadlines/new/recurring", { recurringHelpers });
};

module.exports.createNewRecurring = async (req, res) => {
  const { category, name, interval, nextDue } = req.body;
  const recurring = new Recurring({
    category,
    name,
    interval: parseInt(interval),
    nextDue,
  });
  recurring.owner = req.user._id;
  const savedRecurring = await recurring.save();
  // push the recurring onto the user
  const user = await User.findById(req.user._id);
  user.recurrings.push(savedRecurring);
  await user.save();
  req.flash("success", `Successfully added ${recurring.name} recurring`);
  res.redirect("/deadlines");
};
