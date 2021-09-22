const Expiration = require("../models/document/expiration");
const Recurring = require("../models/recurring/recurring");

module.exports.index = async (req, res) => {
  const expirations = await Expiration.find({
    owner: `${req.user._id}`,
  }).populate({
    path: "document",
    populate: { path: "category" },
  });
  const recurring = await Recurring.find({ owner: `${req.user._id}` });
  for (let deadline of recurring) {
    await deadline.calculateNextDue();
  }
  res.render("deadlines/index", { expirations, recurring });
};
