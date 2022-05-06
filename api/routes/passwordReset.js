// Author: Harsh Bhatt (B00877053)

const router = require("express").Router();

const {
  passwordResetRules,
  validateRequest,
  newPasswordRules,
} = require("../utils/validation");

const {
  sendResetLink,
  resetUserPassword,
} = require("../controllers/passwordReset");

router.post("/", passwordResetRules(), validateRequest, sendResetLink);

router.post(
  "/:userId/:token",
  newPasswordRules(),
  validateRequest,
  resetUserPassword
);

module.exports = router;
