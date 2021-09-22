const Category = require("../models/document/category");
const Document = require("../models/document/document");
const Expiration = require("../models/document/expiration");
const Recurring = require("../models/recurring/recurring");
const User = require("../models/user");

module.exports.index = async (req, res) => {
  const categories = await Category.find({}).populate("documents");
  res.render("admin/documents/index", { categories });
};

module.exports.newDocument = async (req, res) => {
  const document = new Document({ ...req.body });
  await document.save();
  const categories = await Category.find({ _id: req.body.category });
  for (let category of categories) {
    category.documents.push(document);
    await category.save();
  }
  req.flash(
    "success",
    `Successfully added ${document.name} to list of documents`
  );
  res.redirect("/admin/documents");
};

module.exports.newCategory = async (req, res) => {
  const category = new Category({ name: req.body.name });
  await category.save();
  req.flash(
    "success",
    `Successfully added ${category.name} to categories list`
  );
  res.redirect("/admin/documents");
};

module.exports.getNewDocumentForm = async (req, res) => {
  const categories = await Category.find({});
  res.render("admin/documents/new", { categories });
};

module.exports.showDocument = async (req, res) => {
  const { id } = req.params;
  const document = await Document.findById(id).populate("category");
  res.render("admin/documents/show", { document });
};

module.exports.getEditDocumentForm = async (req, res) => {
  const { id } = req.params;
  const categories = await Category.find({});
  const document = await Document.findById(id).populate("category");
  res.render("admin/documents/edit", { document, categories });
};

module.exports.editDocument = async (req, res) => {
  const { id } = req.params;
  const document = await Document.findByIdAndUpdate(id, { ...req.body });
  // Can't figure out how to just delete the document from individual category schemas when editing so for now i'll just delete the document from all of them and then add them back
  for (let category of document.category) {
    const foundCategory = await Category.findById(category._id);
    foundCategory.documents.splice(
      foundCategory.documents.indexOf(document._id),
      1
    );
    await foundCategory.save();
  }
  const categories = await Category.find({ _id: req.body.category });
  // then add documents to category schemas selected when editing
  for (let category of categories) {
    category.documents.push(document);
    await category.save();
  }
  req.flash("success", `Successfully updated ${document.name}`);
  res.redirect(`/admin/documents/${document._id}`);
};

module.exports.userIndex = (req, res) => {
  res.render("admin/users/index");
};

module.exports.generateNotifications = async (req, res) => {
  const expirations = await Expiration.find()
    .populate("document", "name")
    .populate("owner", "email");
  const recurrings = await Recurring.find().populate("owner", "email");
  for (let expiration of expirations) {
    if (expiration.daysUntilDue <= 180) {
      const owner = await User.findById(expiration.owner._id);
      owner.notifications.unshift({
        date: Date.now(),
        subject: expiration.emailMsg.subject,
        text: expiration.emailMsg.text,
      });
      await owner.save();
      // sgMail(expiration.emailMsg);
    }
  }
  for (let recurring of recurrings) {
    if (recurring.daysUntilDue <= 7) {
      const owner = await User.findById(recurring.owner._id);
      owner.notifications.unshift({
        date: Date.now(),
        subject: recurring.emailMsg.subject,
        text: recurring.emailMsg.text,
      });
      await owner.save();
      // sgMail(recurring.emailMsg);
    }
  }
  req.flash("success", "Notifications successfully sent");
  res.redirect("/admin/users");
};
