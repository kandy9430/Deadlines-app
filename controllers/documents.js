const Expiration = require("../models/document/expiration");
const User = require("../models/user");

module.exports.showDocument = async (req, res) => {
  const { id } = req.params;
  const expiration = await Expiration.findById(id).populate({
    path: "document",
    populate: { path: "category" },
  });
  res.render("deadlines/documents/show", { expiration });
};

module.exports.editDocument = async (req, res) => {
  const { id } = req.params;
  const { expires } = req.body;
  const expiration = await Expiration.findByIdAndUpdate(id, {
    expires,
  }).populate("document");
  req.flash(
    "success",
    `Successfully updated ${expiration.document.name} expiration date`
  );
  res.redirect(`/deadlines/document/${expiration._id}`);
};

module.exports.deleteDocument = async (req, res) => {
  const { id } = req.params;
  const expiration = await Expiration.findByIdAndDelete(id).populate(
    "document"
  );
  // remove expiration from user.expirations array
  const owner = await User.findById(expiration.owner);
  const index = owner.documents.indexOf(expiration._id);
  owner.documents.splice(index, 1);
  await owner.save();
  req.flash(
    "success",
    `Successfully deleted ${expiration.document.name} expiration`
  );
  res.redirect("/deadlines");
};

module.exports.showEditPage = async (req, res) => {
  const { id } = req.params;
  const expiration = await Expiration.findById(id).populate("document");
  res.render("deadlines/documents/edit", { expiration });
};
