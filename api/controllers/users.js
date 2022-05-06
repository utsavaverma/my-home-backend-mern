// Author: Harsh Bhatt (B00877053)

const { ROOM_SEEKER, ROOM_OWNER, SUPER_ADMIN } = require("../config/constants");
const {
  userRegister,
  userLogin,
  verifyAccount,
  changePassword,
  updateUser,
  fetchProfile,
} = require("../utils/Auth");

const registerRoomSeeker = async (req, res) => {
  await userRegister(req.body, ROOM_SEEKER, res);
};

const registerRoomOwner = async (req, res) => {
  await userRegister(req.body, ROOM_OWNER, res);
};

const registerSuperAdmin = async (req, res) => {
  await userRegister(req.body, SUPER_ADMIN, res);
};

const loginRoomSeeker = async (req, res) => {
  await userLogin(req.body, ROOM_SEEKER, res);
};

const loginRoomOwner = async (req, res) => {
  await userLogin(req.body, ROOM_OWNER, res);
};

const loginSuperAdmin = async (req, res) => {
  console.log(req.body);
  await userLogin(req.body, SUPER_ADMIN, res);
};

const verifyUserAccount = async (req, res) => {
  await verifyAccount(req.params.verificationToken, res);
};

const changeUserPassword = async (req, res) => {
  const reqObj = {
    oldPassword: req.body.oldPassword,
    newPassword: req.body.newPassword,
    userId: req.user._id,
  };
  await changePassword(reqObj, res);
};

const getUserProfile = async (req, res) => {
  await fetchProfile(req, res);
};

const updateProfile = async (req, res) => {
  await updateUser(req, res);
};

module.exports = {
  registerRoomSeeker,
  registerRoomOwner,
  registerSuperAdmin,
  loginRoomSeeker,
  loginRoomOwner,
  loginSuperAdmin,
  verifyUserAccount,
  changeUserPassword,
  getUserProfile,
  updateProfile,
};
