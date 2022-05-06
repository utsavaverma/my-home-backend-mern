// Author: Sai Vaishnavi Jupudi (B00873534)

const router = require("express").Router();
const { verifyUser, serializeUser, checkRoles } = require("../utils/Auth");

const {
  createbookingController,
  cancelbookingController,
  getbookingByUserController
} = require("../controllers/bookingConfirmationController");

router.post(
  "/booking-confirmation",
  verifyUser,
  createbookingController
);

router.post(
  "/booking-cancellation",
  verifyUser,
  cancelbookingController
);

router.get(
  "/my-bookings",
  verifyUser,
  getbookingByUserController
);

module.exports = router;