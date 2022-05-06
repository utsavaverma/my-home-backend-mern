// Author: Arunkumar Gauda - B00871355
const {
  findallRoomOwners,
  findallRoomSeekers,
  findUnverifiedRoomOwners,
  verifyRoomOwner,
  findRejectedUsers,
  RejectUserById,
  approveUserById,
} = require("../utils/SuperAdmin");

const findallroomowners = async (req, res) => {
  await findallRoomOwners(req, res);
};

const findallroomseekers = async (req, res) => {
  await findallRoomSeekers(req, res);
};

const findunverifiedroomowners = async (req, res) => {
  await findUnverifiedRoomOwners(req, res);
};

const verifyroomowner = async (req, res) => {
  await verifyRoomOwner(req, res);
};

const findrejectedusers = async (req, res) => {
  await findRejectedUsers(req, res);
};

const rejectuserbyid = async (req, res) => {
  await RejectUserById(req, res);
};

const approveuserbyid = async (req, res) => {
  await approveUserById(req, res);
};

module.exports = {
  findallroomowners,
  findallroomseekers,
  findunverifiedroomowners,
  verifyroomowner,
  findrejectedusers,
  rejectuserbyid,
  approveuserbyid,
};
