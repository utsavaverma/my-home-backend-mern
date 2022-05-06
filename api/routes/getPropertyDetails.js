// Author: Sai Vaishnavi Jupudi (B00873534)

const router = require("express").Router();

const {
  getPropertyDetailsController,
} = require("../controllers/getPropertyDetailsController");

router.get(
  "/get-property-details",
  getPropertyDetailsController
);

module.exports = router;
