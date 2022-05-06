// Author: Harsh Bhatt (B00877053)

const router = require("express").Router();
const { ROOM_SEEKER, SUPER_ADMIN } = require("../config/constants");
const {
  registerRoomSeeker,
  registerSuperAdmin,
  registerRoomOwner,
  loginRoomSeeker,
  loginRoomOwner,
  loginSuperAdmin,
  verifyUserAccount,
  changeUserPassword,
  updateProfile,
  getUserProfile,
} = require("../controllers/users");

const { verifyUser, serializeUser, checkRoles } = require("../utils/Auth");

const {
  signupValidationRules,
  loginValidationRules,
  validateRequest,
  changePasswordRules,
  verifyAccountRules,
  updateProfileRules,
} = require("../utils/validation");

// Room Seeker Registration Route

router.post(
  "/register-room-seeker",
  signupValidationRules(),
  validateRequest,
  registerRoomSeeker
);

// Room Owner Registration Route

router.post(
  "/register-room-owner",
  signupValidationRules(),
  validateRequest,
  registerRoomOwner
);

// Super Admin Registration Route

router.post(
  "/register-super-admin",
  signupValidationRules(),
  validateRequest,
  // Only super admin can add other super admins
  verifyUser,
  checkRoles([SUPER_ADMIN]),
  registerSuperAdmin
);

// Room Seeker Login Route

router.post(
  "/login-room-seeker",
  loginValidationRules(),
  validateRequest,
  loginRoomSeeker
);

// Room Owner Login Route

router.post(
  "/login-room-owner",
  loginValidationRules(),
  validateRequest,
  loginRoomOwner
);

// Super Admin Login Route

router.post(
  "/login-super-admin",
  loginValidationRules(),
  validateRequest,
  loginSuperAdmin
);

// Verify & activate account

router.post(
  "/activate-account/:verificationToken",
  verifyAccountRules(),
  validateRequest,
  verifyUserAccount
);

// Profile Route

router.get("/profile", verifyUser, getUserProfile);

router.put(
  "/profile/:userId",
  updateProfileRules(),
  validateRequest,
  verifyUser,
  updateProfile
);

// Change Password

router.post(
  "/change-password",
  changePasswordRules(),
  validateRequest,
  verifyUser,
  changeUserPassword
);

// Protected route

router.get(
  "/protected",
  verifyUser,
  checkRoles([ROOM_SEEKER]),
  async (req, res) => {
    return res.status(200).json(serializeUser(req.user));
  }
);

module.exports = router;
