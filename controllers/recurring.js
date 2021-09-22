const Recurring = require("../models/recurring/recurring");
const recurringHelpers = require("../utils/recurringHelpers");
const User = require("../models/user");

module.exports.showRecurring = async (req, res) => {
  const { id } = req.params;
  const deadline = await Recurring.findById(id);
  const day = recurringHelpers.formatDate(deadline.dayDue);
  res.render("deadlines/recurring/show", { deadline, day });
};

module.exports.editRecurring = async (req, res) => {
  const { id } = req.params;
  const { category, name, interval, nextDue } = req.body;
  const deadline = await Recurring.findByIdAndUpdate(id, {
    category,
    name,
    interval: parseInt(interval),
    nextDue,
  });
  req.flash("success", `Successfully updated ${deadline.name} recurring`);
  res.redirect(`/deadlines/recurring/${id}`);
};

module.exports.deleteRecurring = async (req, res) => {
  const { id } = req.params;
  const deadline = await Recurring.findByIdAndDelete(id);
  // remove recurring from user.recurring array
  const owner = await User.findById(deadline.owner);
  const index = owner.recurrings.indexOf(deadline._id);
  owner.recurrings.splice(index, 1);
  await owner.save();
  req.flash("success", `Successfully deleted ${deadline.name} recurring`);
  res.redirect("/deadlines");
};

module.exports.showEditPage = async (req, res) => {
  const { id } = req.params;
  const intervals = recurringHelpers.intervals;
  const categories = recurringHelpers.categories;
  const deadline = await Recurring.findById(id);
  res.render("deadlines/recurring/edit", { deadline, intervals, categories });
};
