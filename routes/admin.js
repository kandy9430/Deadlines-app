const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  isAdmin,
  validateCategory,
  validateDocument,
} = require("../middleware");
const admin = require("../controllers/admin");

router
  .route("/documents")
  .get(isLoggedIn, isAdmin, catchAsync(admin.index))
  .post(isLoggedIn, isAdmin, validateDocument, catchAsync(admin.newDocument));

router.post(
  "/documents/category",
  isLoggedIn,
  isAdmin,
  validateCategory,
  catchAsync(admin.newCategory)
);

router.get(
  "/documents/new",
  isLoggedIn,
  isAdmin,
  catchAsync(admin.getNewDocumentForm)
);

router
  .route("/documents/:id")
  .get(isLoggedIn, isAdmin, catchAsync(admin.showDocument))
  .put(isLoggedIn, isAdmin, validateDocument, catchAsync(admin.editDocument));

router.get(
  "/documents/:id/edit",
  isLoggedIn,
  isAdmin,
  catchAsync(admin.getEditDocumentForm)
);

router.get("/users", isLoggedIn, isAdmin, admin.userIndex);

// practice path to send notification emails. My email isn't verified and is being picked up as spam but it does send the email to the proper server. I would ideally set this up to run once a day but I'll leave it as a link on the admins permissives for now.
router.use(
  "/msg",
  isLoggedIn,
  isAdmin,
  catchAsync(admin.generateNotifications)
);

module.exports = router;
