const express = require("express");
const router = express.Router();
const deadlines = require("../../controllers/deadlines");
const catchAsync = require("../../utils/catchAsync");
const { isLoggedIn } = require("../../middleware");

// require routes
const newDeadlineRoutes = require("./newDeadlines");
const documentRoutes = require("./documents");
const recurringRoutes = require("./recurring");

// routes
router.use("/new", newDeadlineRoutes);
router.use("/document", documentRoutes);
router.use("/recurring", recurringRoutes);

// all deadlines
router.get("/", isLoggedIn, catchAsync(deadlines.index));

module.exports = router;
