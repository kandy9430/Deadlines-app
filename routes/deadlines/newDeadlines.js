const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const newDeadline = require("../../controllers/newDeadlines");
const {
  validateExpiration,
  isExpirationUnique,
  validateRecurring,
  isLoggedIn,
} = require("../../middleware");

/***************************************************************/
/************************* Documents ***************************/
/***************************************************************/
router
  .route("/type")
  .get(isLoggedIn, newDeadline.showTypeForm)
  .post(isLoggedIn, newDeadline.redirectFromTypeForm);

router
  .route("/document")
  .get(isLoggedIn, catchAsync(newDeadline.newDocumentForm))
  .post(
    isLoggedIn,
    isExpirationUnique,
    validateExpiration,
    catchAsync(newDeadline.createNewDocument)
  );

// the post of the category form will add the category to the session and redirect to the next form to select the document
router.post(
  "/document/category",
  isLoggedIn,
  newDeadline.addDocumentCategoryToSession
);

/***************************************************************/
/************************* Recurring ***************************/
/***************************************************************/
router
  .route("/recurring")
  .get(isLoggedIn, newDeadline.newRecurringForm)
  .post(
    isLoggedIn,
    validateRecurring,
    catchAsync(newDeadline.createNewRecurring)
  );

module.exports = router;
