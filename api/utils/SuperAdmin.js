//Author: Arunkumar Gauda - B00871355

const { ROOM_OWNER, ROOM_SEEKER } = require("../config/constants");
const User = require("../models/User");

const findallRoomOwners = async (req, res) => {
  try {
    const user = await User.find({ role: ROOM_OWNER, status: true });
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

const findallRoomSeekers = async (req, res) => {
  try {
    const user = await User.find({ role: ROOM_SEEKER, status: true });
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

const findUnverifiedRoomOwners = async (req, res) => {
  try {
    const user = await User.find({ role: ROOM_OWNER, accountVerified: false });
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

const verifyRoomOwner = async (req, res) => {
  try {
    const userid = req.params.id;
    console.log(userid);
    await User.updateOne(
      { _id: userid },
      {
        $set: { accountVerified: true },
      }
    );
    const user = await User.findOne({ _id: userid });
    return res.status(200).json({
      message: "Account Verified Successfully",
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

const findRejectedUsers = async (req, res) => {
  try {
    const users = await User.find({ status: false });
    return res.status(200).json({
      success: true,
      message: "Rejected Users: ",
      users,
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

const RejectUserById = async (req, res) => {
  try {
    const userid = req.params.id;
    await User.updateOne(
      { _id: userid },
      {
        $set: { status: false },
      }
    );
    const user = await User.findOne({ _id: userid });
    return res.status(200).json({
      message: user["username"] + " is Rejected !!!",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

const approveUserById = async (req, res) => {
  try {
    const userid = req.params.id;
    await User.updateOne(
      { _id: userid },
      {
        $set: { status: true },
      }
    );
    const user = await User.findOne({ _id: userid });
    return res.status(200).json({
      message: user["username"] + " is Approved!!!",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "An error occurred",
      success: false,
    });
  }
};

module.exports = {
  findallRoomOwners,
  findallRoomSeekers,
  RejectUserById,
  findRejectedUsers,
  findUnverifiedRoomOwners,
  verifyRoomOwner,
  approveUserById,
};
