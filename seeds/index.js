const mongoose = require("mongoose");
const Category = require("../models/document/category");
const Document = require("../models/document/document");
const Expiration = require("../models/document/expiration");

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

const { categories, documents } = require("./seedHelpers");

const seedDB = async () => {
  await Expiration.deleteMany({});
  await Category.deleteMany({});
  await Document.deleteMany({});
  for (let category of categories) {
    const categoryName = category;
    const categorySeed = new Category({ name: categoryName });
    await categorySeed.save();
  }
  for (let document of documents) {
    const { name, description, issuingAuthority, website } = document;
    const documentSeed = new Document({
      name,
      description,
      issuingAuthority,
      website,
    });
    for (let category of document.category) {
      const docCategory = await Category.findOne({ name: category });
      docCategory.documents.push(documentSeed);
      docCategory.save();
      documentSeed.category.push(docCategory);
    }
    await documentSeed.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
