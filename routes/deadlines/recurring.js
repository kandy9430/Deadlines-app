const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const recurring = require("../../controllers/recurring");
const {
  validateRecurring,
  isLoggedIn,
  isRecurringOwner,
} = require("../../middleware");

router
  .route("/:id")
  .get(isLoggedIn, isRecurringOwner, catchAsync(recurring.showRecurring))
  .put(
    isLoggedIn,
    isRecurringOwner,
    validateRecurring,
    catchAsync(recurring.editRecurring)
  )
  .delete(isLoggedIn, isRecurringOwner, catchAsync(recurring.deleteRecurring));

// recurring edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isRecurringOwner,
  catchAsync(recurring.showEditPage)
);

module.exports = router;
