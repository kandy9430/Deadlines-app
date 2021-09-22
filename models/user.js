const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  recurrings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recurring",
    },
  ],
  documents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Expiration",
    },
  ],
  notifications: [
    {
      date: Date,
      subject: String,
      text: String,
      wasRead: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

userSchema.plugin(passportLocalMongoose, {
  usernameQueryFields: ["email"],
  usernameLowerCase: true,
});

module.exports = mongoose.model("User", userSchema);
