const User = require("../models/user");

module.exports.getRegisterForm = (req, res) => {
  res.render("user/register");
};

module.exports.registerNewUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome ${registeredUser.username}`);
      res.redirect("/deadlines");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.getLoginForm = (req, res) => {
  res.render("user/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectURL =
    req.session.returnTo || req.user.admin ? "/admin/documents" : "/deadlines";
  delete req.session.returnTo;
  res.redirect(redirectURL);
};

module.exports.notificationsIndex = (req, res) => {
  res.render("user/notifications/index");
};

module.exports.markAllNotificationsAsRead = async (req, res) => {
  const user = await User.findById(req.user._id);
  const notifications = user.notifications;
  for (let notification of notifications) {
    if (!notification.wasRead) {
      notification.wasRead = true;
    }
  }
  await user.save();
  res.redirect("/user/notifications");
};

module.exports.showNotification = async (req, res) => {
  const { id } = req.params;
  res.render("user/notifications/show", { id });
};

module.exports.markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  // first find the user then find the notification using mongoose parent.child.id(_id) method for subdocuments
  const user = await User.findById(req.user._id);
  const notification = user.notifications.id(id);
  notification.wasRead = true;
  await user.save();
  res.redirect(`/user/notifications/${id}`);
};

module.exports.deleteNotification = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  const notification = user.notifications.id(id);
  const index = user.notifications.indexOf(notification);
  user.notifications.splice(index, 1);
  await user.save();
  res.redirect("/user/notifications");
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/");
};
