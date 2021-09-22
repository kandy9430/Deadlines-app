const mongoose = require("mongoose");
const User = require("../models/user");

mongoose.connect("mongodb://localhost:27017/deadlines", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const seedAdmin = async () => {
  const newAdmin = await User.findById("6130223d3ed78b0ca40b20bb");
  newAdmin.admin = true;
  await newAdmin.save();
};

seedAdmin().then(() => {
  mongoose.connection.close();
});
