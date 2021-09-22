const mongoose = require("mongoose");
const User = require("../user");
const { Schema } = mongoose;

const recurringSchema = new Schema({
  category: {
    type: String,
  },
  name: String,
  interval: {
    type: Number,
    min: 1,
    max: 12,
  },
  nextDue: Date,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

recurringSchema.methods.calculateNextDue = function () {
  if (Date.now() >= this.nextDue.getTime()) {
    const newNextDue = new Date();
    const currentMonth = newNextDue.getUTCMonth();
    if (this.interval === 12) {
      this.nextDue.setUTCFullYear(this.nextDue.getUTCFullYear() + 1);
    } else if (currentMonth + this.interval > 11) {
      newNextDue.setUTCFullYear(newNextDue.getUTCFullYear() + 1);
      const remain = 11 - currentMonth;
      const newMonth = this.interval - remain - 1;
      newNextDue.setUTCMonth(newMonth);
      newNextDue.setUTCDate(this.dayDue);
      this.nextDue = newNextDue;
    } else {
      newNextDue.setUTCMonth(currentMonth + this.interval);
      newNextDue.setUTCDate(this.dayDue);
      this.nextDue = newNextDue;
    }
    return this.save();
  }
};

// virtual for the day of the month that the recurring deadline is due. Based on the nextDue property
recurringSchema.virtual("dayDue").get(function () {
  return this.nextDue.getUTCDate();
});

recurringSchema.virtual("yearNextDue").get(function () {
  return `${this.nextDue.getFullYear()}`;
});

recurringSchema.virtual("monthNextDue").get(function () {
  if (this.nextDue.getUTCMonth() < 9) {
    return `0${this.nextDue.getUTCMonth() + 1}`;
  } else {
    return `${this.nextDue.getUTCMonth() + 1}`;
  }
});

recurringSchema.virtual("dayNextDue").get(function () {
  if (this.nextDue.getUTCDate() < 10) {
    return `0${this.nextDue.getUTCDate()}`;
  } else {
    return `${this.nextDue.getUTCDate()}`;
  }
});

// formatted due date is for a nicer looking date format for the app
recurringSchema.virtual("formattedDueDate").get(function () {
  return `${this.monthNextDue}/${this.dayNextDue}/${this.yearNextDue}`;
});

// dueDateValue is for edit form date input value
recurringSchema.virtual("dueDateValue").get(function () {
  return `${this.yearNextDue}-${this.monthNextDue}-${this.dayNextDue}`;
});

// daysUntilDue is the number of days until it's next due
recurringSchema.virtual("daysUntilDue").get(function () {
  const time = this.nextDue - Date.now();
  const days = time / 1000 / 60 / 60 / 24;
  return `${Math.floor(days)}`;
});

recurringSchema.virtual("emailMsg").get(function () {
  return {
    to: `${this.owner.email}`,
    from: process.env.SENDGRID_VERIFIED_SENDER,
    subject: `${this.name} due date approaching`,
    text: `According to our records, your ${this.name} due date is in ${this.daysUntilDue} days. Please sign in to your account to check the details of this deadline`,
    html: "<p>Sent from Deadlines.com</p><p>This is an automated email. Please do not respond to this email address.</p>",
  };
});

module.exports = mongoose.model("Recurring", recurringSchema);
