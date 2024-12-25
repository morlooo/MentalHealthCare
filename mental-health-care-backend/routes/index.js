const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

const user = require("../controller/user_management");
const form = require("../controller/form_management");
const login = require("../controller/login_management");
const { getDashboardDetails } = require("../controller/dashboard_management");

//register user
router.post("/user", user.registeruser);

// authentication
router.post("/login", login.loginUser);
router.post("/forgot-password", login.sendOtp);
router.post("/verify-otp", login.verifyOtp);
router.patch("/reset/password/:id", login.resetPassword);

//token verification
router.use(verifyToken);

//user
router.get("/dashboard", getDashboardDetails);
router.route("/user").get(user.getusers);
router
  .route("/user/:id")
  .put(verifyToken, user.updateuser)
  .delete(user.deleteuser);

//form
router.route("/form").post(form.fillform).get(form.getforms);
router
  .route("/form/:id")
  .get(form.getuserform)
  .put(form.updateform)
  .delete(form.deleteform);
router.get("/validate/date", form.validatedate);

module.exports = router;
