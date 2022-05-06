// Author: Harsh Bhatt (B00877053)

const { body, validationResult, param } = require("express-validator");

const signupValidationRules = () => {
  return [
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .isLength({ min: 3, max: 15 })
      .withMessage("Username should be between 3 and 15 characters"),
    body("firstName")
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ min: 2, max: 20 })
      .withMessage("First name should be between 2 and 20 characters"),
    body("lastName")
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 2, max: 20 })
      .withMessage("Last name should be between 2 and 20 characters"),
    body("email").notEmpty().withMessage("Email is required").isEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
      )
      .withMessage(
        "Password must contain combination of at least 1 lowercase, 1 uppercase, 1 special characters and numbers"
      ),
    body("passwordConfirmation")
      .notEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
  ];
};

const loginValidationRules = () => {
  return [
    body("usernameOrEmail")
      .notEmpty()
      .withMessage("Username or email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const passwordResetRules = () => {
  return [body("email").notEmpty().withMessage("Email is required").isEmail()];
};

const newPasswordRules = () => {
  return [
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
      )
      .withMessage(
        "Password must contain combination of at least 1 lowercase, 1 uppercase, 1 special characters and numbers"
      ),
    body("passwordConfirmation")
      .notEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
    param("token").notEmpty().withMessage("Token is required"),
  ];
};

const changePasswordRules = () => {
  return [
    body("oldPassword")
      .notEmpty()
      .withMessage("Old Password is required")
      .custom((value, { req }) => {
        if (value === req.body.newPassword) {
          throw new Error("Old Password and New Password can not be same");
        }
        return true;
      }),
    body("newPassword")
      .notEmpty()
      .withMessage("New Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
      )
      .withMessage(
        "Password must contain combination of at least 1 lowercase, 1 uppercase, 1 special characters and numbers"
      ),
    body("passwordConfirmation")
      .notEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
  ];
};

const verifyAccountRules = () => {
  return [
    param("verificationToken").notEmpty().withMessage("Token is required"),
  ];
};

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

// firstName,
//       lastName,
//       phoneNumber,
//       address,
//       city,
//       province,
//       postalCode,

const updateProfileRules = () => {
  return [
    body("firstName")
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ min: 2, max: 20 })
      .withMessage("First name should be between 2 and 20 characters"),
    body("lastName")
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 2, max: 20 })
      .withMessage("Last name should be between 2 and 20 characters"),
    body("phoneNumber")
      .exists()
      .withMessage("Phone number is required")
      .matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
      .withMessage("Invalid phone number"),
    body("gender").notEmpty().withMessage("Gender is required"),
    body("address").exists().withMessage("Address is required"),
    body("city").exists().withMessage("City is required"),
    body("province").exists().withMessage("Province is required"),
    body("postalCode")
      .exists()
      .withMessage("Postal Code is required")
      .matches(
        /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/
      )
      .withMessage("Invalid postal code"),
    param("userId").exists().withMessage("Id is required"),
  ];
};

module.exports = {
  signupValidationRules,
  loginValidationRules,
  passwordResetRules,
  newPasswordRules,
  changePasswordRules,
  verifyAccountRules,
  validateRequest,
  updateProfileRules,
};
