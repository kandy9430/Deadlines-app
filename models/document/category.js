const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: String,
  documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
});

module.exports = mongoose.model("Category", categorySchema);
