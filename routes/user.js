const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const user = require("../controllers/user");
const { isLoggedIn, isNotificationOwner } = require("../middleware");

router
  .route("/register")
  .get(user.getRegisterForm)
  .post(catchAsync(user.registerNewUser));

router
  .route("/login")
  .get(user.getLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.login
  );

router
  .route("/user/notifications")
  .get(isLoggedIn, user.notificationsIndex)
  .put(isLoggedIn, catchAsync(user.markAllNotificationsAsRead));

router
  .route("/user/notifications/:id")
  .get(isLoggedIn, isNotificationOwner, catchAsync(user.showNotification))
  .put(isLoggedIn, isNotificationOwner, catchAsync(user.markNotificationAsRead))
  .delete(isLoggedIn, catchAsync(user.deleteNotification));

router.get("/logout", user.logout);

module.exports = router;
