const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const {
  validateExpiration,
  isLoggedIn,
  isExpirationOwner,
} = require("../../middleware");
const documents = require("../../controllers/documents");

router
  .route("/:id")
  .get(isLoggedIn, isExpirationOwner, catchAsync(documents.showDocument))
  .put(
    isLoggedIn,
    isExpirationOwner,
    validateExpiration,
    catchAsync(documents.editDocument)
  )
  .delete(isLoggedIn, isExpirationOwner, catchAsync(documents.deleteDocument));

router.get(
  "/:id/edit",
  isLoggedIn,
  isExpirationOwner,
  catchAsync(documents.showEditPage)
);

module.exports = router;
