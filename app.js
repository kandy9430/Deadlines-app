if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const sgMail = require("./sendgrid/index");
const ExpressError = require("./utils/expressError");
const Category = require("./models/document/category");
const catchAsync = require("./utils/catchAsync");
const User = require("./models/user");

const path = require("path");
const engine = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");

const express = require("express");
const port = process.env.PORT || 3000;

// routes
const deadlineRoutes = require("./routes/deadlines/deadlines");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

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

const app = express();

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// session
const sessionConfig = {
  secret: "thisisnotagoodsecretchangelater",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash and locals
app.use(flash());
app.use(
  catchAsync(async (req, res, next) => {
    if (req.session.selectedCategory) {
      res.locals.selectedCategory = await Category.findOne({
        name: req.session.selectedCategory,
      }).populate("documents");
    } else {
      res.locals.selectedCategory = undefined;
    }
    res.locals.currentUser = req.user;
    if (req.user) {
      res.locals.unreadNotifications = req.user.notifications.filter(
        (notification) => !notification.wasRead
      );
    }
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.today = Date.now();
    return next();
  })
);

// Routers
app.use("/deadlines", deadlineRoutes);
app.use("/", userRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/alex", (req, res) => {
//   res.send("<h1>I LOVE ALEX!!!!!!!</h1>");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = "500" } = err;
  if (!err.message) err.message = "Oh No! Something Went Wrong!";
  res.status(statusCode).send(err.message);
});

app.listen(port, () => {
  console.log(`App is now running on port ${port}`);
});
