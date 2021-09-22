// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const msg = {
//   to: "at.keane@yahoo.com",
//   from: process.env.SENDGRID_VERIFIED_SENDER,
//   subject: "Sending with SendGrid is Fun",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };

module.exports = (msg) => {
  return sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.log(error);
    });
};
