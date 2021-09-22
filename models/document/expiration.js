const mongoose = require("mongoose");
const { Schema } = mongoose;

const expirationSchema = new Schema({
  document: {
    type: Schema.Types.ObjectId,
    ref: "Document",
  },
  expires: Date,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

expirationSchema.virtual("expiresDate").get(function () {
  if (this.expires.getUTCDate() < 10) {
    return `0${this.expires.getUTCDate()}`;
  } else {
    return `${this.expires.getUTCDate()}`;
  }
});

expirationSchema.virtual("expiresMonth").get(function () {
  if (this.expires.getUTCMonth() < 9) {
    return `0${this.expires.getUTCMonth() + 1}`;
  } else {
    return `${this.expires.getUTCMonth() + 1}`;
  }
});

expirationSchema.virtual("expiresYear").get(function () {
  return this.expires.getUTCFullYear();
});

// formatted expires is for a nicer looking date format for the app
expirationSchema.virtual("formattedExpires").get(function () {
  return `${this.expiresMonth}/${this.expiresDate}/${this.expiresYear}`;
});

// expiresDateValue is for edit form
expirationSchema.virtual("expiresDateValue").get(function () {
  return `${this.expiresYear}-${this.expiresMonth}-${this.expiresDate}`;
});

// daysUntilDue is the number of days until it expires
expirationSchema.virtual("daysUntilDue").get(function () {
  const time = this.expires - Date.now();
  const days = time / 1000 / 60 / 60 / 24;
  return `${Math.floor(days)}`;
});

expirationSchema.virtual("emailMsg").get(function () {
  return {
    to: `${this.owner.email}`,
    from: process.env.SENDGRID_VERIFIED_SENDER,
    subject: `${this.document.name} expiration approaching`,
    text: `According to our records, your ${this.document.name} expires in ${this.daysUntilDue} days. Please sign in to your account to check the details of this document and to renew.`,
    html: "<p>Sent from Deadlines.com</p><p>This is an automated email. Please do not respond to this email address.</p>",
  };
});

module.exports = mongoose.model("Expiration", expirationSchema);
