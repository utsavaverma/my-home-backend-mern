//Author: Arunkumar Gauda - B00871355
const { SUPER_ADMIN } = require("../config/constants");
const {
  findallroomowners,
  findallroomseekers,
  findunverifiedroomowners,
  verifyroomowner,
  findrejectedusers,
  rejectuserbyid,
  approveuserbyid,
} = require("../controllers/superadmin");
const { checkRoles, verifyUser } = require("../utils/Auth");
const router = require("express").Router();

//All Room Owners
router.get(
  "/allroomowners",
  verifyUser,
  checkRoles([SUPER_ADMIN]),
  findallroomowners
);

//All Room Seekers
router.get(
  "/allroomseekers",
  verifyUser,
  checkRoles([SUPER_ADMIN]),
  findallroomseekers
);

//All Unverified Room Owners
router.get(
  "/unverifiedroomowners",
  verifyUser,
  checkRoles([SUPER_ADMIN]),
  findunverifiedroomowners
);

//Account Verification of Room Owner by Id
router.put(
  "/verifyroomowner/:id",
  verifyUser,
  checkRoles([SUPER_ADMIN]),
  verifyroomowner
);

//All Rejected Room Users
router.get(
  "/rejectedusers",
  verifyUser,
  checkRoles([SUPER_ADMIN]),
  findrejectedusers
);

//Reject User by Id
router.put(
  "/rejectuser/:id",
  verifyUser,
  checkRoles([SUPER_ADMIN]),
  rejectuserbyid
);

//Approve User by Id
router.put(
  "/approveuser/:id",
  verifyUser,
  checkRoles([SUPER_ADMIN]),
  approveuserbyid
);

module.exports = router;
