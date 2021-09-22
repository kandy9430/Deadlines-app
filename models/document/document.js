const mongoose = require("mongoose");
const { Schema } = mongoose;
const Category = require("./category");

const documentSchema = new Schema({
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  name: String,
  description: String,
  issuingAuthority: String,
  website: String,
});

// documentSchema.pre('findOneAndUpdate', function() {

// })

module.exports = mongoose.model("Document", documentSchema);
